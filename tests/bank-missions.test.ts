import { describe, it, expect, beforeEach, vi } from 'vitest';
import initSqlJs from 'sql.js';
import { bankWorld } from '../src/modules/worlds/bank';
import { BANK_MISSIONS } from '../src/modules/worlds/bank/missions';
import { BANK_BASE_SCHEMA } from '../src/modules/worlds/bank/schema';
import { BANK_INITIAL_DATASET } from '../src/modules/worlds/bank/dataset';
import { ValidationEngine } from '../src/modules/validation/validation-engine';
import { ValidationContext } from '../src/types/validation';
import { SqlExecutionResponse, SqlDatabaseSchema } from '../src/types/sql';
import { ALL_ACHIEVEMENTS, calculateLevel } from '../src/modules/gamification/achievements';
import { useUserStore } from '../src/stores/useUserStore';
import { persistenceService } from '../src/services/persistence/db-store';

describe('World 5: Bank Operations — Full Playtester Suite', () => {
  let db: any;

  const initFreshDb = async () => {
    const SQL = await initSqlJs();
    db = new SQL.Database();
    db.exec('PRAGMA foreign_keys = ON;');
    db.exec(BANK_BASE_SCHEMA);
    db.exec(BANK_INITIAL_DATASET);
  };

  const getDatabaseSchema = (): SqlDatabaseSchema => {
    const tablesRes = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';");
    const schema: SqlDatabaseSchema = {};
    if (tablesRes.length > 0) {
      for (const row of tablesRes[0].values) {
        const tableName = row[0];
        const colsRes = db.exec(`PRAGMA table_info("${tableName}");`);
        const columns = colsRes[0].values.map((col: any[]) => ({
          name: col[1],
          type: col[2],
          notnull: col[3],
          dflt_value: col[4],
          pk: col[5],
        }));
        schema[tableName] = {
          name: tableName,
          columns,
          foreignKeys: [],
        };
      }
    }
    return schema;
  };

  const executeSql = async (sql: string): Promise<SqlExecutionResponse> => {
    try {
      const results = db.exec(sql);
      const formattedResults = results.map((r: any) => ({
        columns: r.columns,
        values: r.values,
      }));
      return {
        success: true,
        query: sql,
        action: 'SELECT',
        results: formattedResults,
        rowsAffected: db.getRowsModified ? db.getRowsModified() : 0,
        executionTimeMs: 1,
      };
    } catch (err: any) {
      return {
        success: false,
        query: sql,
        action: 'OTHER',
        rowsAffected: 0,
        executionTimeMs: 1,
        error: err?.message || String(err),
      };
    }
  };

  const getContext = (studentSql: string, execResponse: SqlExecutionResponse): ValidationContext => ({
    studentSql,
    executionResponse: execResponse,
    executeSql,
    getSchema: async () => getDatabaseSchema(),
    getTableData: async (tableName: string, limit = 50) => {
      const res = db.exec(`SELECT * FROM "${tableName}" LIMIT ${limit};`);
      return res.length > 0 ? res[0].values : [];
    },
  });

  describe('1. Schema & Dataset Integrity', () => {
    beforeEach(async () => {
      await initFreshDb();
    });

    it('should have bank world definition properly configured', () => {
      expect(bankWorld.id).toBe('bank');
      expect(bankWorld.name).toBe('Bank Operations');
      expect(bankWorld.isAvailable).toBe(true);
      expect(bankWorld.missions).toHaveLength(6);
      expect(bankWorld.reportConfig.metrics.length).toBeGreaterThan(0);
    });

    it('should seed 3 branches, 7 accounts, 8 transactions, 3 cards, and 2 audit logs', () => {
      const branches = db.exec('SELECT COUNT(*) FROM branches;')[0].values[0][0];
      const accounts = db.exec('SELECT COUNT(*) FROM accounts;')[0].values[0][0];
      const txns = db.exec('SELECT COUNT(*) FROM transactions;')[0].values[0][0];
      const cards = db.exec('SELECT COUNT(*) FROM cards;')[0].values[0][0];
      const auditLogs = db.exec('SELECT COUNT(*) FROM audit_logs;')[0].values[0][0];

      expect(branches).toBe(3);
      expect(accounts).toBe(7);
      expect(txns).toBe(8);
      expect(cards).toBe(3);
      expect(auditLogs).toBe(2);
    });

    it('should enforce foreign key integrity between accounts and branches', () => {
      // Trying to insert account with non-existent branch_id 999 must fail
      expect(() => {
        db.exec(
          "INSERT INTO accounts (account_number, customer_name, account_type, balance, branch_id) VALUES ('ACC-ERR-999', 'Ghost Corp', 'Commercial', 1000, 999);"
        );
      }).toThrow(/FOREIGN KEY/i);
    });

    it('should enforce foreign key integrity between transactions and accounts', () => {
      expect(() => {
        db.exec(
          "INSERT INTO transactions (account_id, txn_type, amount, txn_timestamp, channel) VALUES (999, 'DEPOSIT', 5000, '2026-11-16 12:00:00', 'ATM');"
        );
      }).toThrow(/FOREIGN KEY/i);
    });

    it('should execute all executive report queries without errors', async () => {
      for (const metric of bankWorld.reportConfig.metrics) {
        const res = await executeSql(metric.query);
        expect(res.success, `Metric query failed for ${metric.title}: ${res.error}`).toBe(true);
        expect(res.results).toBeDefined();
        expect(res.results!.length).toBeGreaterThan(0);
      }
    });
  });

  describe('2. Sequential Playthrough: Missions 1 to 6', () => {
    beforeEach(async () => {
      await initFreshDb();
    });

    it('Mission 1 (bk_m1): Audit Peer-Group Outliers with Correlated Subqueries', async () => {
      const m1 = BANK_MISSIONS[0];
      const execRes = await executeSql(m1.sampleSolution);
      expect(execRes.success).toBe(true);

      const ctx = getContext(m1.sampleSolution, execRes);
      const feedback = await ValidationEngine.validate(m1.validationRules, ctx);
      expect(feedback.passed).toBe(true);
      expect(execRes.results![0].values.length).toBeGreaterThan(0);
    });

    it('Mission 2 (bk_m2): High-Value Account Transference with CTE', async () => {
      const m2 = BANK_MISSIONS[1];
      const execRes = await executeSql(m2.sampleSolution);
      expect(execRes.success).toBe(true);

      const ctx = getContext(m2.sampleSolution, execRes);
      const feedback = await ValidationEngine.validate(m2.validationRules, ctx);
      expect(feedback.passed).toBe(true);
      expect(execRes.results![0].values.length).toBeGreaterThan(0);
    });

    it('Mission 3 (bk_m3): Window Functions: Cumulative Cash Flow with SUM() OVER', async () => {
      const m3 = BANK_MISSIONS[2];
      const execRes = await executeSql(m3.sampleSolution);
      expect(execRes.success).toBe(true);

      const ctx = getContext(m3.sampleSolution, execRes);
      const feedback = await ValidationEngine.validate(m3.validationRules, ctx);
      expect(feedback.passed).toBe(true);

      const cols = execRes.results![0].columns;
      expect(cols).toEqual(['transaction_id', 'account_id', 'txn_type', 'amount', 'txn_timestamp', 'running_total']);
      expect(execRes.results![0].values.length).toBe(8);
    });

    it('Mission 4 (bk_m4): Window Functions: Offset Audit with LAG() OVER', async () => {
      const m4 = BANK_MISSIONS[3];
      const execRes = await executeSql(m4.sampleSolution);
      expect(execRes.success).toBe(true);

      const ctx = getContext(m4.sampleSolution, execRes);
      const feedback = await ValidationEngine.validate(m4.validationRules, ctx);
      expect(feedback.passed).toBe(true);

      const cols = execRes.results![0].columns;
      expect(cols).toEqual(['transaction_id', 'account_id', 'txn_type', 'amount', 'txn_timestamp', 'prev_amount']);
      expect(execRes.results![0].values.length).toBe(8);
    });

    it('Mission 5 (bk_m5): Window Functions: Partitioned Ranking with DENSE_RANK() OVER', async () => {
      const m5 = BANK_MISSIONS[4];
      const execRes = await executeSql(m5.sampleSolution);
      expect(execRes.success).toBe(true);

      const ctx = getContext(m5.sampleSolution, execRes);
      const feedback = await ValidationEngine.validate(m5.validationRules, ctx);
      expect(feedback.passed).toBe(true);

      const cols = execRes.results![0].columns;
      expect(cols).toEqual(['account_number', 'customer_name', 'branch_id', 'balance', 'branch_rank']);
      expect(execRes.results![0].values.length).toBe(7);
    });

    it('Mission 6 (bk_m6): ACID Transactions: Atomic Funds Transfer', async () => {
      const m6 = BANK_MISSIONS[5];
      const execRes = await executeSql(m6.sampleSolution);
      expect(execRes.success).toBe(true);

      const ctx = getContext(m6.sampleSolution, execRes);
      const feedback = await ValidationEngine.validate(m6.validationRules, ctx);
      expect(feedback.passed).toBe(true);

      const acc2 = db.exec('SELECT balance FROM accounts WHERE account_id = 2;')[0].values[0][0];
      const acc4 = db.exec('SELECT balance FROM accounts WHERE account_id = 4;')[0].values[0][0];
      expect(acc2).toBe(800000.0);
      expect(acc4).toBe(195000.0);

      const txn = db.exec("SELECT amount, channel FROM transactions WHERE account_id = 2 AND txn_type = 'TRANSFER';");
      expect(txn.length).toBe(1);
      expect(txn[0].values[0]).toEqual([50000.0, 'Internal Transfer']);
    });
  });

  describe('3. Intentional Error Injection & Diagnostics Verification', () => {
    beforeEach(async () => {
      await initFreshDb();
    });

    it('Mission 1: catches syntax error in correlated subquery', async () => {
      const badSql = 'SELECT a.account_number FROM accounts a WHERE a.balance > (SELECT AVG(balance FROM accounts);';
      const execRes = await executeSql(badSql);
      expect(execRes.success).toBe(false);

      const ctx = getContext(badSql, execRes);
      const feedback = await ValidationEngine.validate(BANK_MISSIONS[0].validationRules, ctx);
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toMatch(/SQL error|syntax error/i);
    });

    it('Mission 1: catches inverted comparison (< instead of >)', async () => {
      const invertedSql = 'SELECT a.account_number, a.customer_name, a.account_type, a.balance FROM accounts a WHERE a.balance < (SELECT AVG(balance) FROM accounts WHERE account_type = a.account_type) ORDER BY a.balance DESC;';
      const execRes = await executeSql(invertedSql);
      expect(execRes.success).toBe(true);

      const ctx = getContext(invertedSql, execRes);
      const feedback = await ValidationEngine.validate(BANK_MISSIONS[0].validationRules, ctx);
      expect(feedback.passed).toBe(false);
    });

    it('Mission 2: catches syntax error when WITH keyword is missing in CTE', async () => {
      const badCteSql = 'HighValueAccounts AS (SELECT account_id FROM accounts) SELECT * FROM HighValueAccounts;';
      const execRes = await executeSql(badCteSql);
      expect(execRes.success).toBe(false);

      const ctx = getContext(badCteSql, execRes);
      const feedback = await ValidationEngine.validate(BANK_MISSIONS[1].validationRules, ctx);
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toMatch(/syntax error/i);
    });

    it('Mission 2: catches wrong balance filter threshold in CTE', async () => {
      const wrongThreshSql = 'WITH HighValueAccounts AS (SELECT account_id, account_number, customer_name, balance FROM accounts WHERE balance >= 50000000.0) SELECT hva.customer_name, hva.account_number, hva.balance, t.txn_type, t.amount FROM HighValueAccounts hva JOIN transactions t ON hva.account_id = t.account_id ORDER BY t.amount DESC;';
      const execRes = await executeSql(wrongThreshSql);
      expect(execRes.success).toBe(true);

      const ctx = getContext(wrongThreshSql, execRes);
      const feedback = await ValidationEngine.validate(BANK_MISSIONS[1].validationRules, ctx);
      expect(feedback.passed).toBe(false);
    });

    it('Mission 3: catches missing OVER clause in window function', async () => {
      const badWinSql = 'SELECT transaction_id, account_id, txn_type, amount, txn_timestamp, SUM(amount) AS running_total FROM transactions;';
      const execRes = await executeSql(badWinSql);
      const ctx = getContext(badWinSql, execRes);
      const feedback = await ValidationEngine.validate(BANK_MISSIONS[2].validationRules, ctx);
      expect(feedback.passed).toBe(false);
    });

    it('Mission 4: catches LAG without PARTITION BY clause', async () => {
      const badLagSql = 'SELECT transaction_id, account_id, txn_type, amount, txn_timestamp, LAG(amount) OVER (ORDER BY txn_timestamp) AS prev_amount FROM transactions ORDER BY account_id, txn_timestamp;';
      const execRes = await executeSql(badLagSql);
      const ctx = getContext(badLagSql, execRes);
      const feedback = await ValidationEngine.validate(BANK_MISSIONS[3].validationRules, ctx);
      expect(feedback.passed).toBe(false);
    });

    it('Mission 5: catches ordering error in DENSE_RANK', async () => {
      const ascRankSql = 'SELECT account_number, customer_name, branch_id, balance, DENSE_RANK() OVER (PARTITION BY branch_id ORDER BY balance ASC) AS branch_rank FROM accounts ORDER BY branch_id, branch_rank;';
      const execRes = await executeSql(ascRankSql);
      expect(execRes.success).toBe(true);

      const ctx = getContext(ascRankSql, execRes);
      const feedback = await ValidationEngine.validate(BANK_MISSIONS[4].validationRules, ctx);
      expect(feedback.passed).toBe(false);
    });

    it('Mission 6: catches wrong transfer amount in ACID transaction', async () => {
      const wrongAmtSql = `BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 10000.0 WHERE account_id = 2;
UPDATE accounts SET balance = balance + 10000.0 WHERE account_id = 4;
INSERT INTO transactions (account_id, txn_type, amount, txn_timestamp, channel) VALUES (2, 'TRANSFER', 10000.0, '2026-11-16 16:00:00', 'Internal Transfer');
COMMIT;`;
      const execRes = await executeSql(wrongAmtSql);
      expect(execRes.success).toBe(true);

      const ctx = getContext(wrongAmtSql, execRes);
      const feedback = await ValidationEngine.validate(BANK_MISSIONS[5].validationRules, ctx);
      expect(feedback.passed).toBe(false);
    });
  });

  describe('4. XP Calculations and Gamification Progression', () => {
    it('should have correct mission XP rewards totaling 950 XP', () => {
      const expectedRewards = [100, 120, 140, 160, 180, 250];
      const actualRewards = BANK_MISSIONS.map((m) => m.xpReward);
      expect(actualRewards).toEqual(expectedRewards);

      const totalWorldXp = actualRewards.reduce((sum, r) => sum + r, 0);
      expect(totalWorldXp).toBe(950);
    });

    it('should correctly calculate user levels across the playthrough', () => {
      // 0 XP -> Level 1
      expect(calculateLevel(0)).toEqual({
        level: 1,
        currentLevelXp: 0,
        nextLevelXp: 250,
        progressPercent: 0,
      });

      // After bk_m1: 100 XP
      expect(calculateLevel(100)).toEqual({
        level: 1,
        currentLevelXp: 100,
        nextLevelXp: 250,
        progressPercent: 40,
      });

      // After bk_m2: +120 = 220 XP
      expect(calculateLevel(220)).toEqual({
        level: 1,
        currentLevelXp: 220,
        nextLevelXp: 250,
        progressPercent: 88,
      });

      // After bk_m3: +140 = 360 XP -> Level up to Level 2!
      expect(calculateLevel(360)).toEqual({
        level: 2,
        currentLevelXp: 110,
        nextLevelXp: 250,
        progressPercent: 44,
      });

      // After bk_m4: +160 = 520 XP -> Level up to Level 3!
      expect(calculateLevel(520)).toEqual({
        level: 3,
        currentLevelXp: 20,
        nextLevelXp: 250,
        progressPercent: 8,
      });

      // After bk_m5: +180 = 700 XP -> Level 3
      expect(calculateLevel(700)).toEqual({
        level: 3,
        currentLevelXp: 200,
        nextLevelXp: 250,
        progressPercent: 80,
      });

      // After bk_m6: +250 = 950 XP -> Level 4
      expect(calculateLevel(950)).toEqual({
        level: 4,
        currentLevelXp: 200,
        nextLevelXp: 250,
        progressPercent: 80,
      });
    });

    it('should have all bank badges and achievements properly registered in ALL_ACHIEVEMENTS', () => {
      const requiredBadges = [
        'subquery_architect',
        'cte_pioneer',
        'window_specialist',
        'offset_auditor',
        'ranking_expert',
        'acid_master',
        'bank_master',
      ];

      for (const badgeId of requiredBadges) {
        const found = ALL_ACHIEVEMENTS.find((a) => a.id === badgeId);
        expect(found, `Achievement ${badgeId} must be defined in ALL_ACHIEVEMENTS`).toBeDefined();
        expect(found?.title).toBeTruthy();
        expect(found?.description).toBeTruthy();
        expect(found?.xpReward).toBeGreaterThan(0);
      }

      const bankMaster = ALL_ACHIEVEMENTS.find((a) => a.id === 'bank_master')!;
      expect(bankMaster.category).toBe('worlds');
      expect(bankMaster.xpReward).toBe(300);
    });

    it('should unlock achievements and award bonus XP in useUserStore', async () => {
      vi.spyOn(persistenceService, 'saveUserProfile').mockResolvedValue(undefined as any);
      const userStore = useUserStore.getState();

      const initialXp = userStore.profile.xp;

      const unlocked = await userStore.unlockAchievement('subquery_architect');
      expect(unlocked).toBe(true);

      const updatedProfile = useUserStore.getState().profile;
      expect(updatedProfile.achievements).toContain('subquery_architect');
      expect(updatedProfile.xp).toBe(initialXp + 100);

      // Duplicate unlock should return false and not add duplicate XP
      const unlockedAgain = await userStore.unlockAchievement('subquery_architect');
      expect(unlockedAgain).toBe(false);
      expect(useUserStore.getState().profile.xp).toBe(initialXp + 100);

      // Unlock world completion badge bank_master (+300 XP)
      await userStore.markWorldCompleted('bank');
      await userStore.unlockAchievement('bank_master');
      expect(useUserStore.getState().profile.completedWorlds).toContain('bank');
      expect(useUserStore.getState().profile.achievements).toContain('bank_master');
      expect(useUserStore.getState().profile.xp).toBe(initialXp + 100 + 300);
    });
  });
});

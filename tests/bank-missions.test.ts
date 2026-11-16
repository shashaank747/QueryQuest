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

    it('Mission 1 (bk_m1): Deploy suspicious_activity_flags table', async () => {
      const m1 = BANK_MISSIONS[0];
      const execRes = await executeSql(m1.sampleSolution);
      expect(execRes.success).toBe(true);

      const ctx = getContext(m1.sampleSolution, execRes);
      const feedback = await ValidationEngine.validate(m1.validationRules, ctx);
      expect(feedback.passed).toBe(true);

      // Verify table in sqlite_master
      const res = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name='suspicious_activity_flags';");
      expect(res.length).toBe(1);
    });

    it('Mission 2 (bk_m2): Open Commercial High-Net-Worth Account', async () => {
      const m2 = BANK_MISSIONS[1];
      const execRes = await executeSql(m2.sampleSolution);
      expect(execRes.success).toBe(true);

      const ctx = getContext(m2.sampleSolution, execRes);
      const feedback = await ValidationEngine.validate(m2.validationRules, ctx);
      expect(feedback.passed).toBe(true);

      // Verify row data in accounts
      const res = db.exec("SELECT account_number, balance, branch_id FROM accounts WHERE account_id = 8;");
      expect(res[0].values[0]).toEqual(['ACC-BLR-3003', 50000000.0, 3]);
    });

    it('Mission 3 (bk_m3): Audit High-Value Cash Withdrawals', async () => {
      const m3 = BANK_MISSIONS[2];
      const execRes = await executeSql(m3.sampleSolution);
      expect(execRes.success).toBe(true);

      const ctx = getContext(m3.sampleSolution, execRes);
      const feedback = await ValidationEngine.validate(m3.validationRules, ctx);
      expect(feedback.passed).toBe(true);

      // Should return 3 rows of withdrawals >= 50,000
      expect(execRes.results![0].values).toHaveLength(3);
      for (const row of execRes.results![0].values) {
        expect(row[1]).toBe('WITHDRAWAL');
        expect(row[2]).toBeGreaterThanOrEqual(50000);
      }
    });

    it('Mission 4 (bk_m4): Freeze Compromised Payment Card', async () => {
      const m4 = BANK_MISSIONS[3];
      const execRes = await executeSql(m4.sampleSolution);
      expect(execRes.success).toBe(true);

      const ctx = getContext(m4.sampleSolution, execRes);
      const feedback = await ValidationEngine.validate(m4.validationRules, ctx);
      expect(feedback.passed).toBe(true);

      const res = db.exec("SELECT is_active FROM cards WHERE card_number = '4532-8812-9901-3321';");
      expect(res[0].values[0][0]).toBe(0);
    });

    it('Mission 5 (bk_m5): Trace Multi-Million Commercial Wire Transfers', async () => {
      const m5 = BANK_MISSIONS[4];
      const execRes = await executeSql(m5.sampleSolution);
      expect(execRes.success).toBe(true);

      const ctx = getContext(m5.sampleSolution, execRes);
      const feedback = await ValidationEngine.validate(m5.validationRules, ctx);
      expect(feedback.passed).toBe(true);

      // 3 high-value wire transfers (>= 1,000,000)
      const rows = execRes.results![0].values;
      expect(rows).toHaveLength(3);
      // Ordered descending: 4.5M, 3.5M, 1.2M
      expect(rows[0][2]).toBe(4500000.0);
      expect(rows[1][2]).toBe(3500000.0);
      expect(rows[2][2]).toBe(1200000.0);
    });

    it('Mission 6 (bk_m6): Calculate Branch Deposit Liquidity Reserves', async () => {
      // Execute m2 first so accounts has the full state
      await executeSql(BANK_MISSIONS[1].sampleSolution);

      const m6 = BANK_MISSIONS[5];
      const execRes = await executeSql(m6.sampleSolution);
      expect(execRes.success).toBe(true);

      const ctx = getContext(m6.sampleSolution, execRes);
      const feedback = await ValidationEngine.validate(m6.validationRules, ctx);
      expect(feedback.passed).toBe(true);

      const rows = execRes.results![0].values;
      expect(rows).toHaveLength(3);
      // Verify descending order
      expect(rows[0][3]).toBeGreaterThanOrEqual(rows[1][3]);
      expect(rows[1][3]).toBeGreaterThanOrEqual(rows[2][3]);
    });
  });

  describe('3. Intentional Error Injection & Diagnostics Verification', () => {
    beforeEach(async () => {
      await initFreshDb();
    });

    // Mission 1 intentional errors
    it('Mission 1: catches SQL syntax error when CREATE TABLE is malformed', async () => {
      const badSql = 'CREATE TABLE suspicious_activity_flags (flag_id INT PRIMARY KEY;';
      const execRes = await executeSql(badSql);
      expect(execRes.success).toBe(false);

      const ctx = getContext(badSql, execRes);
      const feedback = await ValidationEngine.validate(BANK_MISSIONS[0].validationRules, ctx);
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toMatch(/SQL error|syntax error/i);
    });

    it('Mission 1: catches missing required column (e.g. omitted risk_score)', async () => {
      const missingColSql = `CREATE TABLE suspicious_activity_flags (
        flag_id INTEGER PRIMARY KEY AUTOINCREMENT,
        account_id INTEGER NOT NULL,
        reason TEXT NOT NULL,
        flagged_at TEXT NOT NULL
      );`;
      const execRes = await executeSql(missingColSql);
      expect(execRes.success).toBe(true);

      const ctx = getContext(missingColSql, execRes);
      const feedback = await ValidationEngine.validate(BANK_MISSIONS[0].validationRules, ctx);
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toContain("column 'risk_score' is missing");
    });

    it('Mission 1: catches wrong table name', async () => {
      const wrongTableSql = `CREATE TABLE wrong_aml_table (
        flag_id INTEGER PRIMARY KEY AUTOINCREMENT,
        account_id INTEGER NOT NULL,
        reason TEXT NOT NULL,
        risk_score INTEGER NOT NULL,
        flagged_at TEXT NOT NULL
      );`;
      const execRes = await executeSql(wrongTableSql);
      expect(execRes.success).toBe(true);

      const ctx = getContext(wrongTableSql, execRes);
      const feedback = await ValidationEngine.validate(BANK_MISSIONS[0].validationRules, ctx);
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toContain("Table 'suspicious_activity_flags' does not exist");
    });

    // Mission 2 intentional errors
    it('Mission 2: catches syntax mistake on INSERT', async () => {
      const badInsertSql = 'INSERT INTO accounts (account_id) VALUES (8, ';
      const execRes = await executeSql(badInsertSql);
      expect(execRes.success).toBe(false);

      const ctx = getContext(badInsertSql, execRes);
      const feedback = await ValidationEngine.validate(BANK_MISSIONS[1].validationRules, ctx);
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toMatch(/syntax error/i);
    });

    it('Mission 2: catches wrong account number', async () => {
      const typoSql = `INSERT INTO accounts (account_id, account_number, customer_name, account_type, balance, status, branch_id)
        VALUES (8, 'ACC-BLR-9999', 'Apex Sovereign Capital', 'Commercial', 50000000.0, 'Active', 3);`;
      const execRes = await executeSql(typoSql);
      expect(execRes.success).toBe(true);

      const ctx = getContext(typoSql, execRes);
      const feedback = await ValidationEngine.validate(BANK_MISSIONS[1].validationRules, ctx);
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toMatch(/Verify ACC-BLR-3003 is registered/i);
    });

    it('Mission 2: catches balance calculation mismatch (e.g. 5,000,000 instead of 50,000,000)', async () => {
      const wrongBalanceSql = `INSERT INTO accounts (account_id, account_number, customer_name, account_type, balance, status, branch_id)
        VALUES (8, 'ACC-BLR-3003', 'Apex Sovereign Capital', 'Commercial', 5000000.0, 'Active', 3);`;
      const execRes = await executeSql(wrongBalanceSql);
      expect(execRes.success).toBe(true);

      const ctx = getContext(wrongBalanceSql, execRes);
      const feedback = await ValidationEngine.validate(BANK_MISSIONS[1].validationRules, ctx);
      expect(feedback.passed).toBe(false);
      expect(feedback.details?.expected).toContain('50000000');
    });

    // Mission 3 intentional errors
    it('Mission 3: catches syntax mistake on SELECT', async () => {
      const badSql = 'SELECT account_id, txn_type FROMM transactions;';
      const execRes = await executeSql(badSql);
      expect(execRes.success).toBe(false);

      const ctx = getContext(badSql, execRes);
      const feedback = await ValidationEngine.validate(BANK_MISSIONS[2].validationRules, ctx);
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toMatch(/syntax error/i);
    });

    it('Mission 3: catches transaction type filtering error (filtering DEPOSIT instead of WITHDRAWAL)', async () => {
      const wrongTypeSql = "SELECT account_id, txn_type, amount, channel FROM transactions WHERE txn_type = 'DEPOSIT' AND amount >= 50000;";
      const execRes = await executeSql(wrongTypeSql);
      expect(execRes.success).toBe(true);

      const ctx = getContext(wrongTypeSql, execRes);
      const feedback = await ValidationEngine.validate(BANK_MISSIONS[2].validationRules, ctx);
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toMatch(/data values returned do not match/i);
    });

    it('Mission 3: catches threshold filtering error (amount >= 100000)', async () => {
      const highThresholdSql = "SELECT account_id, txn_type, amount, channel FROM transactions WHERE txn_type = 'WITHDRAWAL' AND amount >= 100000;";
      const execRes = await executeSql(highThresholdSql);
      expect(execRes.success).toBe(true);

      const ctx = getContext(highThresholdSql, execRes);
      const feedback = await ValidationEngine.validate(BANK_MISSIONS[2].validationRules, ctx);
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toContain('Returned 1 record(s), but 3 were expected');
    });

    // Mission 4 intentional errors
    it('Mission 4: catches wrong card number on UPDATE', async () => {
      const wrongCardSql = "UPDATE cards SET is_active = 0 WHERE card_number = '5421-1190-4432-8765';";
      const execRes = await executeSql(wrongCardSql);
      expect(execRes.success).toBe(true);

      const ctx = getContext(wrongCardSql, execRes);
      const feedback = await ValidationEngine.validate(BANK_MISSIONS[3].validationRules, ctx);
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toMatch(/Verify card is deactivated/i);
    });

    it('Mission 4: catches setting is_active = 1 instead of 0', async () => {
      const wrongStatusSql = "UPDATE cards SET is_active = 1 WHERE card_number = '4532-8812-9901-3321';";
      const execRes = await executeSql(wrongStatusSql);
      expect(execRes.success).toBe(true);

      const ctx = getContext(wrongStatusSql, execRes);
      const feedback = await ValidationEngine.validate(BANK_MISSIONS[3].validationRules, ctx);
      expect(feedback.passed).toBe(false);
      expect(feedback.details?.expected).toContain('is_active = 0');
    });

    // Mission 5 intentional errors
    it('Mission 5: catches threshold filtering error (amount >= 4000000 returns 1 row instead of 3)', async () => {
      const highThreshSql = `SELECT a.customer_name, a.account_number, t.amount, t.channel, t.txn_timestamp
        FROM accounts a JOIN transactions t ON a.account_id = t.account_id
        WHERE t.amount >= 4000000.0 ORDER BY t.amount DESC;`;
      const execRes = await executeSql(highThreshSql);
      expect(execRes.success).toBe(true);

      const ctx = getContext(highThreshSql, execRes);
      const feedback = await ValidationEngine.validate(BANK_MISSIONS[4].validationRules, ctx);
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toContain('Returned 1 record(s), but 3 were expected');
    });

    it('Mission 5: catches threshold filtering error (amount >= 5000000 returns 0 rows)', async () => {
      const emptyThreshSql = `SELECT a.customer_name, a.account_number, t.amount, t.channel, t.txn_timestamp
        FROM accounts a JOIN transactions t ON a.account_id = t.account_id
        WHERE t.amount >= 5000000.0 ORDER BY t.amount DESC;`;
      const execRes = await executeSql(emptyThreshSql);
      expect(execRes.success).toBe(true);

      const ctx = getContext(emptyThreshSql, execRes);
      const feedback = await ValidationEngine.validate(BANK_MISSIONS[4].validationRules, ctx);
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toContain('Your query did not return any data rows. A SELECT query is required.');
    });

    it('Mission 5: catches ordering error (ASC instead of DESC) due to orderSensitive check', async () => {
      const ascSql = `SELECT a.customer_name, a.account_number, t.amount, t.channel, t.txn_timestamp
        FROM accounts a JOIN transactions t ON a.account_id = t.account_id
        WHERE t.amount >= 1000000.0 ORDER BY t.amount ASC;`;
      const execRes = await executeSql(ascSql);
      expect(execRes.success).toBe(true);

      const ctx = getContext(ascSql, execRes);
      const feedback = await ValidationEngine.validate(BANK_MISSIONS[4].validationRules, ctx);
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toMatch(/ordering|ORDER BY/i);
    });

    // Mission 6 intentional errors
    it('Mission 6: catches missing GROUP BY resulting in single aggregated row', async () => {
      const noGroupSql = `SELECT b.branch_name, b.city, COUNT(a.account_id) AS total_accounts, SUM(a.balance) AS total_deposits
        FROM branches b JOIN accounts a ON b.branch_id = a.branch_id
        ORDER BY total_deposits DESC;`;
      const execRes = await executeSql(noGroupSql);
      expect(execRes.success).toBe(true);

      const ctx = getContext(noGroupSql, execRes);
      const feedback = await ValidationEngine.validate(BANK_MISSIONS[5].validationRules, ctx);
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toContain('Returned 1 record(s), but 3 were expected');
    });

    it('Mission 6: catches wrong aggregation function (AVG instead of SUM)', async () => {
      const avgSql = `SELECT b.branch_name, b.city, COUNT(a.account_id) AS total_accounts, AVG(a.balance) AS total_deposits
        FROM branches b JOIN accounts a ON b.branch_id = a.branch_id
        GROUP BY b.branch_name, b.city
        ORDER BY total_deposits DESC;`;
      const execRes = await executeSql(avgSql);
      expect(execRes.success).toBe(true);

      const ctx = getContext(avgSql, execRes);
      const feedback = await ValidationEngine.validate(BANK_MISSIONS[5].validationRules, ctx);
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toMatch(/values|ordering/i);
    });

    it('Mission 6: catches ascending order instead of descending order', async () => {
      const ascSql = `SELECT b.branch_name, b.city, COUNT(a.account_id) AS total_accounts, SUM(a.balance) AS total_deposits
        FROM branches b JOIN accounts a ON b.branch_id = a.branch_id
        GROUP BY b.branch_name, b.city
        ORDER BY total_deposits ASC;`;
      const execRes = await executeSql(ascSql);
      expect(execRes.success).toBe(true);

      const ctx = getContext(ascSql, execRes);
      const feedback = await ValidationEngine.validate(BANK_MISSIONS[5].validationRules, ctx);
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toMatch(/ordering|ORDER BY/i);
    });
  });

  describe('4. XP Calculations and Gamification Progression', () => {
    it('should have correct mission XP rewards totaling 900 XP', () => {
      const expectedRewards = [100, 120, 130, 140, 160, 250];
      const actualRewards = BANK_MISSIONS.map((m) => m.xpReward);
      expect(actualRewards).toEqual(expectedRewards);

      const totalWorldXp = actualRewards.reduce((sum, r) => sum + r, 0);
      expect(totalWorldXp).toBe(900);
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

      // After bk_m3: +130 = 350 XP -> Level up to Level 2!
      expect(calculateLevel(350)).toEqual({
        level: 2,
        currentLevelXp: 100,
        nextLevelXp: 250,
        progressPercent: 40,
      });

      // After bk_m4: +140 = 490 XP -> Level 2
      expect(calculateLevel(490)).toEqual({
        level: 2,
        currentLevelXp: 240,
        nextLevelXp: 250,
        progressPercent: 96,
      });

      // After bk_m5: +160 = 650 XP -> Level 3
      expect(calculateLevel(650)).toEqual({
        level: 3,
        currentLevelXp: 150,
        nextLevelXp: 250,
        progressPercent: 60,
      });

      // After bk_m6: +250 = 900 XP -> Level 4
      expect(calculateLevel(900)).toEqual({
        level: 4,
        currentLevelXp: 150,
        nextLevelXp: 250,
        progressPercent: 60,
      });
    });

    it('should have all bank badges and achievements properly registered in ALL_ACHIEVEMENTS', () => {
      const requiredBadges = ['table_architect', 'ledger_auditor', 'join_master', 'bank_master'];

      for (const badgeId of requiredBadges) {
        const found = ALL_ACHIEVEMENTS.find((a) => a.id === badgeId);
        expect(found, `Achievement ${badgeId} must be defined in ALL_ACHIEVEMENTS`).toBeDefined();
        expect(found?.title).toBeTruthy();
        expect(found?.description).toBeTruthy();
        expect(found?.xpReward).toBeGreaterThan(0);
      }

      // Check specific bank achievements
      const ledgerAuditor = ALL_ACHIEVEMENTS.find((a) => a.id === 'ledger_auditor')!;
      expect(ledgerAuditor.category).toBe('missions');
      expect(ledgerAuditor.xpReward).toBe(120);

      const bankMaster = ALL_ACHIEVEMENTS.find((a) => a.id === 'bank_master')!;
      expect(bankMaster.category).toBe('worlds');
      expect(bankMaster.xpReward).toBe(300);
    });

    it('should unlock achievements and award bonus XP in useUserStore', async () => {
      vi.spyOn(persistenceService, 'saveUserProfile').mockResolvedValue(undefined as any);
      const userStore = useUserStore.getState();

      // Test unlocking ledger_auditor
      const initialAchievements = userStore.profile.achievements;
      const initialXp = userStore.profile.xp;

      const unlocked = await userStore.unlockAchievement('ledger_auditor');
      expect(unlocked).toBe(true);

      const updatedProfile = useUserStore.getState().profile;
      expect(updatedProfile.achievements).toContain('ledger_auditor');
      // ledger_auditor awards 120 XP as defined in ALL_ACHIEVEMENTS
      expect(updatedProfile.xp).toBe(initialXp + 120);

      // Duplicate unlock should return false and not add duplicate XP
      const unlockedAgain = await userStore.unlockAchievement('ledger_auditor');
      expect(unlockedAgain).toBe(false);
      expect(useUserStore.getState().profile.xp).toBe(initialXp + 120);

      // Unlock world completion badge bank_master (+300 XP)
      await userStore.markWorldCompleted('bank');
      await userStore.unlockAchievement('bank_master');
      expect(useUserStore.getState().profile.completedWorlds).toContain('bank');
      expect(useUserStore.getState().profile.achievements).toContain('bank_master');
      expect(useUserStore.getState().profile.xp).toBe(initialXp + 120 + 300);
    });
  });
});

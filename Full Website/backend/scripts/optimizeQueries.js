const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Module = require('../models/Module');
const Team = require('../models/Team');
const Notification = require('../models/Notification');

async function analyzeQueryPerformance() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    console.log('\n' + '='.repeat(60));
    console.log('QUERY PERFORMANCE ANALYSIS');
    console.log('='.repeat(60));

    // Common queries to test
    const queries = [
      {
        name: 'User by email lookup',
        model: User,
        query: () => User.findOne({ email: 'test@example.com' }).explain('executionStats')
      },
      {
        name: 'Users by department',
        model: User,
        query: () => User.find({ department: 'IT', isActive: true }).explain('executionStats')
      },
      {
        name: 'Users leaderboard',
        model: User,
        query: () => User.find({ isActive: true })
          .sort({ 'stats.totalPoints': -1 })
          .limit(10)
          .explain('executionStats')
      },
      {
        name: 'Modules by category',
        model: Module,
        query: () => Module.find({ category: 'Banking Fundamentals', status: 'published' })
          .explain('executionStats')
      },
      {
        name: 'Featured modules',
        model: Module,
        query: () => Module.find({ isFeatured: true, status: 'published', isActive: true })
          .sort({ 'stats.averageRating': -1 })
          .explain('executionStats')
      },
      {
        name: 'Module search',
        model: Module,
        query: () => Module.find({ 
          $text: { $search: 'banking customer service' },
          status: 'published'
        }).explain('executionStats')
      },
      {
        name: 'Teams by department',
        model: Team,
        query: () => Team.find({ department: 'IT', isActive: true })
          .sort({ 'stats.memberCount': -1 })
          .explain('executionStats')
      },
      {
        name: 'User notifications',
        model: Notification,
        query: () => Notification.find({ 
          userId: new mongoose.Types.ObjectId(),
          isRead: false 
        })
        .sort({ createdAt: -1 })
        .limit(20)
        .explain('executionStats')
      }
    ];

    const results = [];

    for (const { name, query } of queries) {
      try {
        console.log(`\nAnalyzing: ${name}`);
        
        const startTime = Date.now();
        const explanation = await query();
        const endTime = Date.now();
        
        const stats = explanation.executionStats;
        const indexUsage = explanation.queryPlanner?.winningPlan?.inputStage || {};
        
        const result = {
          name,
          executionTime: `${endTime - startTime}ms`,
          totalDocsExamined: stats.totalDocsExamined,
          totalDocsReturned: stats.totalDocsReturned,
          executionTimeMillis: stats.executionTimeMillis,
          indexUsed: indexUsage.indexName || 'COLLSCAN',
          stage: indexUsage.stage || 'UNKNOWN',
          efficiency: stats.totalDocsExamined > 0 
            ? ((stats.totalDocsReturned / stats.totalDocsExamined) * 100).toFixed(2) + '%'
            : '100%'
        };
        
        results.push(result);
        
        // Display results
        console.log(`  ⏱️  Execution time: ${result.executionTime}`);
        console.log(`  📊 Documents examined: ${result.totalDocsExamined}`);
        console.log(`  🎣 Documents returned: ${result.totalDocsReturned}`);
        console.log(`  📋 Index used: ${result.indexUsed}`);
        console.log(`  ⚡ Efficiency: ${result.efficiency}`);
        
        // Flag potential issues
        if (result.indexUsed === 'COLLSCAN') {
          console.log(`  ⚠️  WARNING: Collection scan detected - consider adding index`);
        }
        
        if (stats.totalDocsExamined > stats.totalDocsReturned * 10) {
          console.log(`  ⚠️  WARNING: Low efficiency - examined ${stats.totalDocsExamined} to return ${stats.totalDocsReturned}`);
        }
        
        if (stats.executionTimeMillis > 100) {
          console.log(`  ⚠️  WARNING: Slow query - ${stats.executionTimeMillis}ms execution time`);
        }
        
      } catch (error) {
        console.error(`  ❌ Error analyzing ${name}:`, error.message);
        results.push({
          name,
          error: error.message
        });
      }
    }

    // Summary report
    console.log('\n' + '='.repeat(60));
    console.log('PERFORMANCE SUMMARY');
    console.log('='.repeat(60));
    
    const successfulQueries = results.filter(r => !r.error);
    const slowQueries = successfulQueries.filter(r => parseInt(r.executionTimeMillis) > 100);
    const collScans = successfulQueries.filter(r => r.indexUsed === 'COLLSCAN');
    const inefficientQueries = successfulQueries.filter(r => parseFloat(r.efficiency) < 50);
    
    console.log(`📊 Total queries analyzed: ${results.length}`);
    console.log(`✅ Successful queries: ${successfulQueries.length}`);
    console.log(`❌ Failed queries: ${results.filter(r => r.error).length}`);
    console.log(`🐌 Slow queries (>100ms): ${slowQueries.length}`);
    console.log(`🔍 Collection scans: ${collScans.length}`);
    console.log(`⚠️  Inefficient queries (<50%): ${inefficientQueries.length}`);
    
    // Recommendations
    console.log('\n' + '='.repeat(60));
    console.log('OPTIMIZATION RECOMMENDATIONS');
    console.log('='.repeat(60));
    
    if (collScans.length > 0) {
      console.log('\n📋 Collection Scans Detected:');
      collScans.forEach(q => {
        console.log(`  - ${q.name}: Consider adding appropriate index`);
      });
    }
    
    if (slowQueries.length > 0) {
      console.log('\n🐌 Slow Queries:');
      slowQueries.forEach(q => {
        console.log(`  - ${q.name}: ${q.executionTimeMillis}ms - Review query structure and indexes`);
      });
    }
    
    if (inefficientQueries.length > 0) {
      console.log('\n⚠️  Inefficient Queries:');
      inefficientQueries.forEach(q => {
        console.log(`  - ${q.name}: ${q.efficiency} efficiency - Consider compound indexes`);
      });
    }
    
    if (collScans.length === 0 && slowQueries.length === 0 && inefficientQueries.length === 0) {
      console.log('\n🎉 All queries are performing well!');
    }
    
  } catch (error) {
    console.error('Error analyzing query performance:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

async function suggestOptimizations() {
  try {
    console.log('\n' + '='.repeat(60));
    console.log('OPTIMIZATION SUGGESTIONS');
    console.log('='.repeat(60));
    
    const suggestions = [
      {
        category: 'User Model',
        suggestions: [
          'Consider partitioning users by department for large datasets',
          'Add TTL index for session cleanup',
          'Consider archiving inactive users',
          'Optimize friend relationship queries with denormalization'
        ]
      },
      {
        category: 'Module Model',
        suggestions: [
          'Cache popular module statistics',
          'Consider read replicas for module catalog queries',
          'Pre-aggregate module ratings and stats',
          'Implement module recommendation caching'
        ]
      },
      {
        category: 'Team Model',
        suggestions: [
          'Denormalize member count for faster sorting',
          'Cache team leaderboard data',
          'Consider team activity log cleanup',
          'Pre-calculate team statistics'
        ]
      },
      {
        category: 'General',
        suggestions: [
          'Implement Redis caching for frequently accessed data',
          'Use MongoDB views for complex aggregations',
          'Consider horizontal scaling for high-traffic collections',
          'Implement database connection pooling optimization',
          'Monitor slow query logs in production',
          'Use explain() regularly to verify index usage'
        ]
      }
    ];
    
    suggestions.forEach(({ category, suggestions: items }) => {
      console.log(`\n📊 ${category}:`);
      items.forEach(item => {
        console.log(`  • ${item}`);
      });
    });
    
  } catch (error) {
    console.error('Error generating suggestions:', error);
  }
}

// Run analysis
if (require.main === module) {
  console.log('🚀 Starting MongoDB Query Performance Analysis');
  
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI environment variable is required');
    process.exit(1);
  }
  
  (async () => {
    await analyzeQueryPerformance();
    await suggestOptimizations();
    process.exit(0);
  })();
}

module.exports = { analyzeQueryPerformance, suggestOptimizations };
import React from 'react';
import { analyticsService } from '../../services/analytics';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const AnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = React.useState<any[]>([]);

  React.useEffect(() => {
    const storedAnalytics = analyticsService.getStoredAnalytics();
    setAnalytics(storedAnalytics);
  }, []);

  const getCompletionTimeData = () => {
    return analytics.map(entry => ({
      timestamp: new Date(entry.timestamp).toLocaleDateString(),
      timeSpent: entry.totalTimeSpent / 1000 / 60, // Convert to minutes
    }));
  };

  const getErrorData = () => {
    const errorData = analytics.reduce((acc: any[], entry) => {
      Object.entries(entry.errorCounts).forEach(([section, count]) => {
        acc.push({ section, count });
      });
      return acc;
    }, []);

    return errorData;
  };

  const getFieldInteractionData = () => {
    const latestEntry = analytics[analytics.length - 1];
    if (!latestEntry) return [];

    return Object.entries(latestEntry.fieldInteractions).map(([field, data]: [string, any]) => ({
      field,
      interactions: data.focusCount + data.changeCount,
      timeSpent: Math.round(data.timeSpent / 1000) // Convert to seconds
    }));
  };

  const getCompletionRateData = () => {
    const rates = analytics.map(entry => entry.formCompletionRate);
    const average = rates.reduce((a, b) => a + b, 0) / rates.length;
    return [
      { name: 'Completed', value: average },
      { name: 'Incomplete', value: 100 - average }
    ];
  };

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold mb-6">Form Analytics Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Completion Time Trend */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Form Completion Time Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getCompletionTimeData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="timeSpent" stroke="#8884d8" name="Time Spent" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Error Distribution */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Error Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getErrorData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="section" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" name="Error Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Field Interactions */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Field Interactions</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getFieldInteractionData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="field" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="interactions" fill="#8884d8" name="Interactions" />
              <Bar dataKey="timeSpent" fill="#82ca9d" name="Time Spent (s)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Completion Rate */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Average Completion Rate</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getCompletionRateData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {getCompletionRateData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Statistics */}
        <div className="col-span-1 md:col-span-2 bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Summary Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {analytics.length > 0 && (
              <>
                <div className="p-4 bg-blue-50 rounded">
                  <h4 className="text-sm font-medium text-blue-600">Average Completion Time</h4>
                  <p className="text-2xl font-bold text-blue-800">
                    {(analytics.reduce((acc, entry) => acc + entry.totalTimeSpent, 0) / analytics.length / 1000 / 60).toFixed(1)} min
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded">
                  <h4 className="text-sm font-medium text-green-600">Success Rate</h4>
                  <p className="text-2xl font-bold text-green-800">
                    {(analytics.filter(entry => entry.performanceMetrics.successfulSubmit).length / analytics.length * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 rounded">
                  <h4 className="text-sm font-medium text-yellow-600">Average Fields Completed</h4>
                  <p className="text-2xl font-bold text-yellow-800">
                    {(analytics.reduce((acc, entry) => acc + Object.keys(entry.fieldInteractions).length, 0) / analytics.length).toFixed(1)}
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded">
                  <h4 className="text-sm font-medium text-purple-600">Mobile Usage</h4>
                  <p className="text-2xl font-bold text-purple-800">
                    {(analytics.filter(entry => entry.browserInfo.isMobile).length / analytics.length * 100).toFixed(1)}%
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 
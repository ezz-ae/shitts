import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminDashboardPage = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl font-headline font-bold">Admin Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-body">Welcome to the admin panel. Use the sidebar to navigate.</p>
        {/* Add more dashboard content here, e.g., quick stats, recent activity */}
      </CardContent>
    </Card>
  );
};

export default AdminDashboardPage;

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Clock,
  ChefHat,
  Store,
  Activity,
  Calendar,
} from "lucide-react";

import { useTranslation } from "@/hooks/useTranslation";

export function DashboardContent() {
  const { t } = useTranslation();

  // Mock data - in real app this would come from your NestJS backend
  const kpis = [
    {
      title: t("dashboard.totalRevenue"),
      value: "$54,230",
      change: "+12.5%",
      changeType: "positive" as const,
      icon: DollarSign,
      description: t("dashboard.revenueDescription"),
    },
    {
      title: t("dashboard.totalOrders"),
      value: "1,234",
      change: "+8.2%",
      changeType: "positive" as const,
      icon: ShoppingCart,
      description: t("dashboard.ordersDescription"),
    },
    {
      title: t("dashboard.activeStaff"),
      value: "24",
      change: "-2.1%",
      changeType: "negative" as const,
      icon: Users,
      description: t("dashboard.staffDescription"),
    },
    {
      title: t("dashboard.avgOrderTime"),
      value: "12.5 min",
      change: "-5.3%",
      changeType: "positive" as const,
      icon: Clock,
      description: t("dashboard.orderTimeDescription"),
    },
  ];

  const recentOrders = [
    {
      id: "#1234",
      table: "Table 5",
      items: 3,
      total: "$45.80",
      status: "preparing",
      time: "5 min ago",
    },
    {
      id: "#1235",
      table: "Table 2",
      items: 2,
      total: "$28.50",
      status: "ready",
      time: "8 min ago",
    },
    {
      id: "#1236",
      table: "Delivery",
      items: 4,
      total: "$62.30",
      status: "completed",
      time: "12 min ago",
    },
    {
      id: "#1237",
      table: "Table 8",
      items: 1,
      total: "$15.20",
      status: "pending",
      time: "15 min ago",
    },
  ];

  const topItems = [
    { name: "Margherita Pizza", orders: 45, revenue: "$675" },
    { name: "Chicken Burger", orders: 38, revenue: "$532" },
    { name: "Caesar Salad", orders: 32, revenue: "$384" },
    { name: "Pasta Carbonara", orders: 28, revenue: "$420" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "preparing":
        return "bg-yellow-500";
      case "ready":
        return "bg-green-500";
      case "completed":
        return "bg-blue-500";
      case "pending":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "preparing":
        return t("dashboard.preparing");
      case "ready":
        return t("dashboard.ready");
      case "completed":
        return t("dashboard.completed");
      case "pending":
        return t("dashboard.pending");
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("dashboard.title")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t("dashboard.welcome")}
          </p>
        </div>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
            {t("dashboard.today")}
          </Button>
          <Button size="sm">
            <Activity className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
            {t("dashboard.realTime")}
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground rtl:space-x-reverse">
                {kpi.changeType === "positive" ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span
                  className={
                    kpi.changeType === "positive"
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {kpi.change}
                </span>
                <span>{kpi.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
              <ShoppingCart className="h-5 w-5" />
              <span>{t("dashboard.recentOrders")}</span>
            </CardTitle>
            <CardDescription>
              {t("dashboard.recentOrdersDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="flex flex-col">
                      <span className="font-medium">{order.id}</span>
                      <span className="text-sm text-gray-500">
                        {order.table}
                      </span>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                  <div className="text-right rtl:text-left">
                    <div className="font-medium">{order.total}</div>
                    <div className="text-sm text-gray-500">{order.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Menu Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
              <ChefHat className="h-5 w-5" />
              <span>{t("dashboard.topMenuItems")}</span>
            </CardTitle>
            <CardDescription>
              {t("dashboard.topMenuItemsDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="font-bold text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-500">
                        {item.orders} {t("dashboard.orders")}
                      </div>
                    </div>
                  </div>
                  <div className="font-medium">{item.revenue}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.quickActions")}</CardTitle>
          <CardDescription>
            {t("dashboard.quickActionsDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <ChefHat className="h-6 w-6" />
              <span className="text-xs">{t("dashboard.manageMenu")}</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Users className="h-6 w-6" />
              <span className="text-xs">{t("dashboard.viewStaff")}</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Store className="h-6 w-6" />
              <span className="text-xs">{t("dashboard.manageLocations")}</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <TrendingUp className="h-6 w-6" />
              <span className="text-xs">{t("dashboard.viewReports")}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

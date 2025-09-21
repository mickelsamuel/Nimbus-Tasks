import { Card, CardContent, CardHeader, CardTitle, cn } from "@nimbus/ui";

interface StatsCardProps {
  title: string;
  value: number;
  description: string;
  isLoading?: boolean;
  className?: string;
}

export function StatsCard({
  title,
  value,
  description,
  isLoading = false,
  className,
}: StatsCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isLoading ? (
            <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
          ) : (
            value
          )}
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
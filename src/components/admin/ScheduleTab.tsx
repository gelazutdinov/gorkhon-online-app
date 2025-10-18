import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";
import { WorkScheduleItem } from './types';

interface ScheduleTabProps {
  workSchedule: WorkScheduleItem[];
  setWorkSchedule: (schedule: WorkScheduleItem[]) => void;
  addItem: (type: string) => void;
  removeItem: (type: string, index: number) => void;
}

const ScheduleTab = ({
  workSchedule,
  setWorkSchedule,
  addItem,
  removeItem
}: ScheduleTabProps) => {
  return (
    <Card className="border-2 border-orange-200 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
        <CardTitle className="flex items-center gap-3 text-orange-700">
          <Icon name="Clock" size={24} />
          Режим работы организаций
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        {workSchedule.map((item, idx) => (
          <div key={idx} className="bg-white rounded-xl p-4 border-2 border-gray-100 hover:border-orange-300 transition-all space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Название организации"
                value={item.name}
                onChange={(e) => {
                  const updated = [...workSchedule];
                  updated[idx].name = e.target.value;
                  setWorkSchedule(updated);
                }}
              />
              <Input
                placeholder="Расписание"
                value={item.schedule}
                onChange={(e) => {
                  const updated = [...workSchedule];
                  updated[idx].schedule = e.target.value;
                  setWorkSchedule(updated);
                }}
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => removeItem('schedule', idx)}
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Icon name="Trash2" size={16} className="mr-1" />
                Удалить
              </Button>
            </div>
          </div>
        ))}
        <Button
          onClick={() => addItem('schedule')}
          variant="outline"
          className="w-full border-2 border-dashed border-orange-300 hover:border-orange-500 hover:bg-orange-50"
        >
          <Icon name="Plus" size={18} className="mr-2" />
          Добавить расписание
        </Button>
      </CardContent>
    </Card>
  );
};

export default ScheduleTab;

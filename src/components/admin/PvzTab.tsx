import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";
import { PvzItem } from './types';

interface PvzTabProps {
  pvzItems: PvzItem[];
  setPvzItems: (items: PvzItem[]) => void;
  addItem: (type: string) => void;
  removeItem: (type: string, index: number) => void;
}

const PvzTab = ({
  pvzItems,
  setPvzItems,
  addItem,
  removeItem
}: PvzTabProps) => {
  return (
    <Card className="border-2 border-indigo-200 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardTitle className="flex items-center gap-3 text-indigo-700">
          <Icon name="Package" size={24} />
          Пункты выдачи заказов
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        {pvzItems.map((item, idx) => (
          <div key={idx} className="bg-white rounded-xl p-4 border-2 border-gray-100 hover:border-indigo-300 transition-all space-y-3">
            <Input
              placeholder="Название ПВЗ"
              value={item.name}
              onChange={(e) => {
                const updated = [...pvzItems];
                updated[idx].name = e.target.value;
                setPvzItems(updated);
              }}
            />
            <Input
              placeholder="Адрес"
              value={item.address}
              onChange={(e) => {
                const updated = [...pvzItems];
                updated[idx].address = e.target.value;
                setPvzItems(updated);
              }}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Режим работы"
                value={item.schedule}
                onChange={(e) => {
                  const updated = [...pvzItems];
                  updated[idx].schedule = e.target.value;
                  setPvzItems(updated);
                }}
              />
              <Input
                placeholder="Телефон"
                value={item.phone}
                onChange={(e) => {
                  const updated = [...pvzItems];
                  updated[idx].phone = e.target.value;
                  setPvzItems(updated);
                }}
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => removeItem('pvz', idx)}
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
          onClick={() => addItem('pvz')}
          variant="outline"
          className="w-full border-2 border-dashed border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50"
        >
          <Icon name="Plus" size={18} className="mr-2" />
          Добавить ПВЗ
        </Button>
      </CardContent>
    </Card>
  );
};

export default PvzTab;

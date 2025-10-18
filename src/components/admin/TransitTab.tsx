import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";
import { ImportantNumber } from './types';

interface TransitTabProps {
  transitNumbers: ImportantNumber[];
  setTransitNumbers: (numbers: ImportantNumber[]) => void;
  addItem: (type: string) => void;
  removeItem: (type: string, index: number) => void;
}

const TransitTab = ({
  transitNumbers,
  setTransitNumbers,
  addItem,
  removeItem
}: TransitTabProps) => {
  return (
    <Card className="border-2 border-green-200 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
        <CardTitle className="flex items-center gap-3 text-green-700">
          <Icon name="Bus" size={24} />
          Расписание транспорта
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        {transitNumbers.map((item, idx) => (
          <div key={idx} className="bg-white rounded-xl p-4 border-2 border-gray-100 hover:border-green-300 transition-all space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input
                placeholder="Название"
                value={item.name}
                onChange={(e) => {
                  const updated = [...transitNumbers];
                  updated[idx].name = e.target.value;
                  setTransitNumbers(updated);
                }}
              />
              <Input
                placeholder="Описание"
                value={item.person}
                onChange={(e) => {
                  const updated = [...transitNumbers];
                  updated[idx].person = e.target.value;
                  setTransitNumbers(updated);
                }}
              />
              <Input
                placeholder="Телефон"
                value={item.phone}
                onChange={(e) => {
                  const updated = [...transitNumbers];
                  updated[idx].phone = e.target.value;
                  setTransitNumbers(updated);
                }}
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => removeItem('transit', idx)}
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
          onClick={() => addItem('transit')}
          variant="outline"
          className="w-full border-2 border-dashed border-green-300 hover:border-green-500 hover:bg-green-50"
        >
          <Icon name="Plus" size={18} className="mr-2" />
          Добавить маршрут
        </Button>
      </CardContent>
    </Card>
  );
};

export default TransitTab;

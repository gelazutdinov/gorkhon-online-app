import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";
import { ImportantNumber } from './types';

interface ImportantNumbersTabProps {
  importantNumbers: ImportantNumber[];
  setImportantNumbers: (numbers: ImportantNumber[]) => void;
  addItem: (type: string) => void;
  removeItem: (type: string, index: number) => void;
}

const ImportantNumbersTab = ({
  importantNumbers,
  setImportantNumbers,
  addItem,
  removeItem
}: ImportantNumbersTabProps) => {
  return (
    <Card className="border-2 border-purple-200 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardTitle className="flex items-center gap-3 text-purple-700">
          <Icon name="Phone" size={24} />
          Важные номера телефонов
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        {importantNumbers.map((item, idx) => (
          <div key={idx} className="bg-white rounded-xl p-4 border-2 border-gray-100 hover:border-purple-300 transition-all space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input
                placeholder="Название"
                value={item.name}
                onChange={(e) => {
                  const updated = [...importantNumbers];
                  updated[idx].name = e.target.value;
                  setImportantNumbers(updated);
                }}
              />
              <Input
                placeholder="Контактное лицо"
                value={item.person}
                onChange={(e) => {
                  const updated = [...importantNumbers];
                  updated[idx].person = e.target.value;
                  setImportantNumbers(updated);
                }}
              />
              <Input
                placeholder="Телефон"
                value={item.phone}
                onChange={(e) => {
                  const updated = [...importantNumbers];
                  updated[idx].phone = e.target.value;
                  setImportantNumbers(updated);
                }}
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => removeItem('numbers', idx)}
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
          onClick={() => addItem('numbers')}
          variant="outline"
          className="w-full border-2 border-dashed border-purple-300 hover:border-purple-500 hover:bg-purple-50"
        >
          <Icon name="Plus" size={18} className="mr-2" />
          Добавить номер
        </Button>
      </CardContent>
    </Card>
  );
};

export default ImportantNumbersTab;

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@/components/ui/icon";
import { HelpItem } from './types';

interface HelpTabProps {
  helpItems: HelpItem[];
  setHelpItems: (items: HelpItem[]) => void;
  addItem: (type: string) => void;
  removeItem: (type: string, index: number) => void;
}

const HelpTab = ({
  helpItems,
  setHelpItems,
  addItem,
  removeItem
}: HelpTabProps) => {
  return (
    <Card className="border-2 border-red-200 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-red-50 to-rose-50">
        <CardTitle className="flex items-center gap-3 text-red-700">
          <Icon name="Heart" size={24} />
          Помощь посёлку
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        {helpItems.map((item, idx) => (
          <div key={idx} className="bg-white rounded-xl p-4 border-2 border-gray-100 hover:border-red-300 transition-all space-y-3">
            <Input
              placeholder="Название"
              value={item.title}
              onChange={(e) => {
                const updated = [...helpItems];
                updated[idx].title = e.target.value;
                setHelpItems(updated);
              }}
            />
            <Textarea
              placeholder="Описание"
              value={item.description}
              onChange={(e) => {
                const updated = [...helpItems];
                updated[idx].description = e.target.value;
                setHelpItems(updated);
              }}
            />
            <Input
              placeholder="Контакт"
              value={item.contact}
              onChange={(e) => {
                const updated = [...helpItems];
                updated[idx].contact = e.target.value;
                setHelpItems(updated);
              }}
            />
            <div className="flex justify-end">
              <Button
                onClick={() => removeItem('help', idx)}
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
          onClick={() => addItem('help')}
          variant="outline"
          className="w-full border-2 border-dashed border-red-300 hover:border-red-500 hover:bg-red-50"
        >
          <Icon name="Plus" size={18} className="mr-2" />
          Добавить
        </Button>
      </CardContent>
    </Card>
  );
};

export default HelpTab;

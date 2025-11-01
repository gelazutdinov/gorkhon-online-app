import Icon from '@/components/ui/icon';

interface ImportantNumber {
  id: string;
  name: string;
  person: string;
  phone: string;
  icon: string;
  category: 'important' | 'transit';
}

interface PreviewTabProps {
  siteTitle: string;
  siteDescription: string;
  importantNumbers: ImportantNumber[];
  transitNumbers: ImportantNumber[];
}

const PreviewTab = ({
  siteTitle,
  siteDescription,
  importantNumbers,
  transitNumbers
}: PreviewTabProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Предпросмотр контента</h3>
      
      <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
        <div className="space-y-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">{siteTitle}</h1>
            <p className="text-gray-600">{siteDescription}</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Icon name="Phone" size={16} />
                Важные номера
              </h4>
              <div className="space-y-2">
                {importantNumbers.map((num) => (
                  <div key={num.id} className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                      <Icon name={num.icon as any} size={16} className="text-blue-600" />
                      <div>
                        <p className="font-medium text-sm">{num.name}</p>
                        <p className="text-xs text-gray-600">{num.person}</p>
                        <p className="text-xs font-mono text-blue-600">{num.phone}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Icon name="Bus" size={16} />
                Транзит
              </h4>
              <div className="space-y-2">
                {transitNumbers.map((num) => (
                  <div key={num.id} className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Icon name={num.icon as any} size={16} className="text-blue-600" />
                      <div>
                        <p className="font-medium text-sm">{num.name}</p>
                        <p className="text-xs text-gray-600">{num.person}</p>
                        <p className="text-xs font-mono text-blue-600">{num.phone}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewTab;
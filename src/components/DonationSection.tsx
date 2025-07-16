import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

const DonationSection = () => {
  const donationData = [
    {
      title: "ФОНД поселка",
      recipient: "Ирина Н.П",
      account: "408 178 109 091 606 626 11",
      note: "Обязательно пишем 'ФОНД поселка'",
      icon: "Home",
      gradient: "bg-gradient-blue"
    },
    {
      title: "Помощь церкви ⛪️",
      recipient: "Голофаева В.",
      account: "89024562839",
      note: "Поддержка храма",
      icon: "Heart",
      gradient: "bg-gradient-warm"
    },
    {
      title: "Помощь бойцам 🪖",
      recipient: "Олеся Николаевна Н.",
      account: "89246210100",
      note: "В теме: 'Помощь Бойцам'",
      icon: "Shield",
      gradient: "bg-gradient-brand"
    }
  ];

  return (
    <Card className="animate-fade-in rounded-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-gorkhon-blue">
          <Icon name="Heart" size={20} />
          Помощь поселку
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {donationData.map((donation, index) => (
          <div key={index} className={`p-4 rounded-2xl ${donation.gradient} text-white relative overflow-hidden`}>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Icon name={donation.icon as any} size={18} />
                <h4 className="font-medium">{donation.title}</h4>
              </div>
              <p className="text-sm opacity-90 mb-1">{donation.recipient}</p>
              <p className="text-sm font-mono bg-white/20 p-2 rounded mb-2">
                {donation.account}
              </p>
              <p className="text-xs opacity-80">{donation.note}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default DonationSection;
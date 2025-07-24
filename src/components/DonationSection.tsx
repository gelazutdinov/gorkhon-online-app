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
    <Card className="animate-fade-in rounded-2xl bg-gradient-to-br from-white to-green-50/30 border-2 border-gorkhon-green/10 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-gorkhon-green">
          <div className="p-2 rounded-full bg-gorkhon-green/10 animate-pulse">
            <Icon name="Heart" size={20} />
          </div>
          <div>
            <span className="text-lg font-bold">💝 Помощь поселку</span>
            <p className="text-sm text-slate-600 font-normal">Вместе мы сильнее!</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {donationData.map((donation, index) => (
          <div key={index} className={`group p-5 rounded-2xl ${donation.gradient} text-white relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}>
            {/* Floating decorative elements */}
            <div className="absolute top-2 right-4 w-12 h-12 bg-white/10 rounded-full opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <div className="absolute bottom-2 left-4 w-8 h-8 bg-white/5 rounded-full opacity-30 group-hover:opacity-50 transition-opacity"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
                  <Icon name={donation.icon as any} size={20} />
                </div>
                <h4 className="font-bold text-lg">{donation.title}</h4>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icon name="User" size={14} className="opacity-80" />
                  <p className="text-sm opacity-90">{donation.recipient}</p>
                </div>
                
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl border border-white/30">
                  <p className="text-sm font-mono text-center tracking-wider font-semibold">
                    {donation.account}
                  </p>
                </div>
                
                <div className="flex items-start gap-2 mt-3">
                  <Icon name="Info" size={12} className="opacity-70 mt-0.5" />
                  <p className="text-xs opacity-80 leading-relaxed">{donation.note}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200/50">
          <div className="flex items-center gap-2 text-emerald-800 mb-2">
            <Icon name="Users" size={16} />
            <p className="text-sm font-semibold">Благодарим за поддержку!</p>
          </div>
          <p className="text-xs text-emerald-700">Каждый вклад делает наш поселок лучше и уютнее для всех жителей 🏘️</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DonationSection;
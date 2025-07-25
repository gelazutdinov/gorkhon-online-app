import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import SecurityHeader from './components/SecurityHeader';
import TechnicalSecuritySection from './components/TechnicalSecuritySection';
import OrganizationalSecuritySection from './components/OrganizationalSecuritySection';
import DataNotStoredSection from './components/DataNotStoredSection';
import UserControlSection from './components/UserControlSection';
import IncidentResponseSection from './components/IncidentResponseSection';
import ComplianceSection from './components/ComplianceSection';
import SecurityContactsSection from './components/SecurityContactsSection';

const DataProtection = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Кнопка возврата на платформу */}
      <div className="mb-6">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-4 py-2 bg-gorkhon-blue text-white rounded-lg hover:bg-gorkhon-blue/90 transition-colors"
        >
          <Icon name="ArrowLeft" size={16} />
          <span>Вернуться на платформу</span>
        </Link>
      </div>

      <SecurityHeader />

      {/* Разделы защиты данных */}
      <div className="space-y-4">
        <TechnicalSecuritySection 
          activeSection={activeSection} 
          toggleSection={toggleSection} 
        />
        
        <OrganizationalSecuritySection 
          activeSection={activeSection} 
          toggleSection={toggleSection} 
        />
        
        <DataNotStoredSection 
          activeSection={activeSection} 
          toggleSection={toggleSection} 
        />
        
        <UserControlSection 
          activeSection={activeSection} 
          toggleSection={toggleSection} 
        />
        
        <IncidentResponseSection 
          activeSection={activeSection} 
          toggleSection={toggleSection} 
        />
        
        <ComplianceSection 
          activeSection={activeSection} 
          toggleSection={toggleSection} 
        />
      </div>

      <SecurityContactsSection />
    </div>
  );
};

export default DataProtection;
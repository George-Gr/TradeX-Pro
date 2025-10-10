import { Outlet } from 'react-router-dom';
import Analytics from './Analytics';
import CopyTrading from './CopyTrading';
import Security from './Security';
import WebTrading from './WebTrading';

const Features = () => {
  return (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  );
};

Features.WebTrading = WebTrading;
Features.CopyTrading = CopyTrading;
Features.Analytics = Analytics;
Features.Security = Security;

export default Features;

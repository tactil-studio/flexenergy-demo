import { FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { EmptyState } from '@/components/ui/empty-state';
import { ContractCardSkeleton, HeroSkeleton } from '@/components/ui/skeleton';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { ContractCard } from '../components/ContractCard';
import { DashboardHero } from '../components/DashboardHero';
import { QuickActions } from '../components/QuickActions';
import { useDashboard } from '../hooks/useDashboard';
import { useDashboardChart } from '../hooks/useDashboardChart';

export function DashboardView() {
  const { totalBalanceFormatted, contracts, consume, isLoading } = useDashboard();
  const { data: chartData, isLoading: chartLoading, trend } = useDashboardChart();
  const { setView } = useApp();
  const { user } = useAuth();

  const firstDaysLeft = contracts[0]?.daysLeft;

  return (
    <div className="space-y-5 md:space-y-6 pt-4 lg:pt-6">

      {isLoading ? (
        <HeroSkeleton />
      ) : (
        <DashboardHero
          totalBalanceFormatted={totalBalanceFormatted}
          consume={consume}
          chartData={chartData}
          chartLoading={chartLoading}
          trend={trend}
          firstName={user?.firstName}
          firstDaysLeft={firstDaysLeft}
        />
      )}

      <QuickActions
        onRecharge={() => setView('recharge')}
        onUsage={() => setView('usage')}
        onHistory={() => setView('history')}
        onSettings={() => setView('settings')}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <ContractCardSkeleton />
          <ContractCardSkeleton />
        </div>
      ) : contracts.length > 0 ? (
        <motion.ul
          className={`list-none p-0 ${contracts.length > 1 ? 'grid grid-cols-1 xl:grid-cols-2 gap-4' : ''}`}
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {contracts.map((c) => (
            <motion.li
              key={c.contractId}
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <ContractCard c={c} onRecharge={() => setView('recharge')} />
            </motion.li>
          ))}
        </motion.ul>
      ) : (
        <EmptyState
          icon={FileText}
          title="No contracts found"
          description="There are no active contracts associated with your account."
        />
      )}
    </div>
  );
}

import { fetchPropertyById } from '@/lib/api-properties';
import { fetchEmployees } from '@/lib/api-employees';
import { propertyToNovostroykaDetail } from '@/lib/adapters/property-to-detail';
import { DetailHero, DetailSidebar } from '@/components/site/novostroyki-detail/detail-hero';
import { DetailTabs } from '@/components/site/novostroyki-detail/detail-tabs';
import { DetailContent } from '@/components/site/novostroyki-detail/detail-content';
import { DetailExtra } from '@/components/site/novostroyki-detail/detail-extra';
import { ViewTracker } from '@/components/site/common/view-tracker'; // ✅ Yangi import
import { notFound } from 'next/navigation';

export default async function NovostroykaDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  
  let property;
  let employees = [];
  
  try {
    const [propRes, empRes] = await Promise.all([
      fetchPropertyById(id),
      fetchEmployees().catch(() => [])
    ]);
    
    property = propRes;
    employees = empRes;
  } catch (error) {
    console.error('Property topilmadi:', id, error);
    notFound();
  }
  
  if (!property) return notFound();

  const data = propertyToNovostroykaDetail(property);
  const consultant = employees.length > 0 ? employees[0] : null;

  return (
    <main className="nzd-main">
      {/* ✅ Ko'rish tarixiga yozish */}
      <ViewTracker propertyId={id} />
      
      <DetailHero data={data} />
      <DetailTabs />
      
      <div className="w">
        <div className="nzd-layout">
          <div className="nzd-left">
            <DetailContent data={data} />
            <DetailExtra data={data} />
          </div>
          <DetailSidebar data={data} consultant={consultant} /> 
        </div>
      </div>
    </main>
  );
}
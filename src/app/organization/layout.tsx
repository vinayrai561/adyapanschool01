import PortalLayout from '@/components/portal/PortalLayout';

export default function OrganizationLayout({ children }: { children: React.ReactNode }) {
  return <PortalLayout portalType="organization">{children}</PortalLayout>;
}

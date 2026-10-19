// Opens the detail route for a single beneficiary record.
// Owns the route parameter passed to the beneficiary detail view.
// Does not fetch client data or manage beneficiary actions.

import BeneficiaryDetails from "./BeneficiaryDetails";

export default async function BeneficiaryDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BeneficiaryDetails beneficiaryId={id} />;
}

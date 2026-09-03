import React from 'react';
import CompanyData from './CompanyData';
import ClientData from './ClientData';
import ConceptList from './ConceptList';
import TotalsAndConditions from './TotalsAndConditions';

export default function BudgetForm({
  company,
  client,
  setClient,
  concepts,
  onAddConcept,
  onAddCustomConcept,
  onUpdateConcept,
  onRemoveConcept,
  onDuplicateConcept,
  totals,
  discountPercent,
  setDiscountPercent,
  applyTax,
  setApplyTax,
  taxRate,
  setTaxRate,
  conditions,
  setConditions
}) {
  return (
    <div className="space-y-4 pb-12">
      {/* Datos Emisor (Fijos) */}
      <CompanyData company={company} />

      {/* Datos Cliente */}
      <ClientData client={client} setClient={setClient} />

      {/* Conceptos e Instalaciones */}
      <ConceptList
        concepts={concepts}
        onAddConcept={onAddConcept}
        onAddCustomConcept={onAddCustomConcept}
        onUpdateConcept={onUpdateConcept}
        onRemoveConcept={onRemoveConcept}
        onDuplicateConcept={onDuplicateConcept}
      />

      {/* Descuentos, IVA y Totales */}
      <TotalsAndConditions
        totals={totals}
        discountPercent={discountPercent}
        setDiscountPercent={setDiscountPercent}
        applyTax={applyTax}
        setApplyTax={setApplyTax}
        taxRate={taxRate}
        setTaxRate={setTaxRate}
        conditions={conditions}
        setConditions={setConditions}
      />
    </div>
  );
}

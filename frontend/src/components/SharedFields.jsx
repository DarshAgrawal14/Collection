import React from "react";

export default function SharedFields({
  formData,
  handleChange,
  region,
  setRegion,
  type,
  setType,
  after1947,
  setAfter1947,
  isCommemorative,
  setIsCommemorative
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          name="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="p-3 border rounded"
        >
          <option value="">All Types</option>
          <option value="Coin">Coin</option>
          <option value="Note">Note</option>
        </select>

        <select
          name="region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="p-3 border rounded"
        >
          <option value="">All Regions</option>
          <option value="India">India</option>
          <option value="Others">Others</option>
        </select>
      </div>

      <input type="text" name="currency" placeholder="Currency" value={formData.currency} onChange={handleChange} className="p-3 border rounded w-full" />
      <input type="text" name="denomination" placeholder="Denomination" value={formData.denomination} onChange={handleChange} className="p-3 border rounded w-full" />
      <input type="text" name="coinValue" placeholder="Coin Value" value={formData.coinValue} onChange={handleChange} className="p-3 border rounded w-full" />
      <input type="text" name="year" placeholder="Year" value={formData.year} onChange={handleChange} className="p-3 border rounded w-full" />
      <input type="text" name="mint" placeholder="Mint" value={formData.mint} onChange={handleChange} className="p-3 border rounded w-full" />
      <input type="text" name="issuer" placeholder="Issuer" value={formData.issuer} onChange={handleChange} className="p-3 border rounded w-full" />
      <input type="text" name="ruler" placeholder="Ruler" value={formData.ruler} onChange={handleChange} className="p-3 border rounded w-full" />
      <input type="text" name="metal" placeholder="Metal" value={formData.metal} onChange={handleChange} className="p-3 border rounded w-full" />
      <input type="text" name="weight" placeholder="Weight" value={formData.weight} onChange={handleChange} className="p-3 border rounded w-full" />
      <input type="text" name="script" placeholder="Script" value={formData.script} onChange={handleChange} className="p-3 border rounded w-full" />
      <input type="text" name="ruleDuration" placeholder="Rule Duration" value={formData.ruleDuration} onChange={handleChange} className="p-3 border rounded w-full" />
      <input type="text" name="condition" placeholder="Condition (VF, XF, UNC)" value={formData.condition} onChange={handleChange} className="p-3 border rounded w-full" />
      <input type="text" name="notes" placeholder="Notes" value={formData.notes} onChange={handleChange} className="p-3 border rounded w-full" />
      <input type="number" name="quantity" placeholder="Quantity" value={formData.quantity} onChange={handleChange} className="p-3 border rounded w-full" />
      <input type="text" name="purchaseValue" placeholder="Purchase Value" value={formData.purchaseValue} onChange={handleChange} className="p-3 border rounded w-full" />
      <input type="text" name="currentValue" placeholder="Current Value" value={formData.currentValue} onChange={handleChange} className="p-3 border rounded w-full" />

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={after1947}
            onChange={(e) => setAfter1947(e.target.checked)}
          />
          <span>After 1947</span>
        </label>

        {type === "Coin" && (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isCommemorative}
              onChange={(e) => setIsCommemorative(e.target.checked)}
            />
            <span>Commemorative</span>
          </label>
        )}

        {type === "Coin" && (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isMule"
              checked={formData.isMule || false}
              onChange={(e) => handleChange({
                target: { name: "isMule", value: e.target.checked }
              })}
            />
            <span>Mule</span>
          </label>
        )}
      </div>

      {formData.isMule && (
        <input
          type="text"
          name="muleDescription"
          placeholder="Mule Description"
          value={formData.muleDescription}
          onChange={handleChange}
          className="p-3 border rounded w-full"
        />
      )}

      {isCommemorative && (
        <>
          <input
            type="text"
            name="commemorativeNameFor"
            placeholder="Commemorated Person/Event"
            value={formData.commemorativeNameFor}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
          <input
            type="text"
            name="commemorativeRange"
            placeholder="Commemorative Series"
            value={formData.commemorativeRange}
            onChange={handleChange}
            className="p-3 border rounded w-full"
          />
        </>
      )}
    </div>
  );
}

"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Plus, Minus } from 'lucide-react';

// ... (keep all the existing type definitions and state management code)

const PositionEditor = ({ position, scenarioId, index, onRemove }: any) => {
  return (
    <div className="flex items-center space-x-4 mb-6 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-gray-100">
      <div className="space-y-1 w-48">
        <label className="text-sm text-gray-600 font-medium">Position Title</label>
        <input 
          type="text"
          value={position.title}
          onChange={(e) => updatePosition(scenarioId, index, 'title', e.target.value)}
          disabled={!position.editable}
          className={`${position.editable ? 'border' : 'bg-gray-100'} p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          placeholder="Position Title"
        />
      </div>
      
      <div className="space-y-1 w-24">
        <label className="text-sm text-gray-600 font-medium">Type</label>
        <select 
          value={position.payType}
          onChange={(e) => updatePosition(scenarioId, index, 'payType', e.target.value)}
          disabled={!position.editable}
          className={`${position.editable ? 'border' : 'bg-gray-100'} p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
        >
          <option value="salary">Salary</option>
          <option value="hourly">Hourly</option>
        </select>
      </div>
      
      <div className="space-y-1 w-32">
        <label className="text-sm text-gray-600 font-medium">Pay Rate</label>
        <input 
          type="number"
          value={position.pay || ''}
          onChange={(e) => updatePosition(scenarioId, index, 'pay', parseFloat(e.target.value) || 0)}
          disabled={!position.editable && !position.payEditable}
          placeholder={position.payType === 'hourly' ? 'Hourly rate' : 'Annual salary'}
          className={`${position.editable || position.payEditable ? 'border' : 'bg-gray-100'} p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
        />
      </div>

      <div className="flex-grow space-y-2 px-4 py-2 bg-gray-50 rounded">
        <div className="text-sm font-medium text-gray-600">Calculations:</div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-xs text-gray-500">Annual</div>
            <div className="font-medium">${calculateAnnual(position.pay, position.payType).toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Monthly</div>
            <div className="font-medium">${calculateMonthly(calculateAnnual(position.pay, position.payType)).toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Biweekly</div>
            <div className="font-medium">${calculateBiweekly(calculateAnnual(position.pay, position.payType)).toLocaleString()}</div>
          </div>
        </div>
      </div>

      {onRemove && position.editable && (
        <button
          onClick={onRemove}
          className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded border border-red-200 hover:border-red-300 transition-colors duration-200"
          title="Remove position"
        >
          <Minus size={16} />
          <span className="text-sm">Remove</span>
        </button>
      )}
    </div>
  );
};

// Update the return section to include better spacing and organization
return (
    <Card className="w-full max-w-5xl shadow-lg">
      <CardHeader className="border-b">
        <CardTitle className="text-2xl text-gray-800">Organization Scenarios</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="1">
          <TabsList className="mb-6">
            <TabsTrigger value="1">Scenario 1</TabsTrigger>
            <TabsTrigger value="2">Scenario 2</TabsTrigger>
            <TabsTrigger value="3">Scenario 3</TabsTrigger>
          </TabsList>

          {Object.entries(scenarios).map(([scenarioId, scenario]) => (
            <TabsContent value={scenarioId} key={scenarioId}>
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <PositionEditor 
                    position={scenario.director} 
                    scenarioId={scenarioId} 
                    index="director"
                  />
                </div>
                
                {scenario.manager.title ? (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <PositionEditor 
                      position={scenario.manager} 
                      scenarioId={scenarioId} 
                      index="manager"
                      onRemove={() => removeManager(scenarioId)}
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => addManager(scenarioId)}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-4 px-4 py-2 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                  >
                    <Plus size={20} />
                    <span>Add Sales Manager</span>
                  </button>
                )}

                {scenario.reports.map((report: any, index: number) => (
                  <PositionEditor 
                    key={index}
                    position={report}
                    scenarioId={scenarioId}
                    index={index}
                    onRemove={() => removePosition(scenarioId, index)}
                  />
                ))}

                <button
                  onClick={() => addPosition(scenarioId)}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 px-4 py-2 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors duration-200 mt-8"
                >
                  <Plus size={20} />
                  <span>Add Position</span>
                </button>

                <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">Scenario {scenarioId} Totals</h3>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="p-4 bg-white rounded shadow-sm">
                      <div className="text-sm text-gray-500 mb-1">Annual Total</div>
                      <div className="text-lg font-semibold">${calculateTotals(scenario).annual.toLocaleString()}</div>
                    </div>
                    <div className="p-4 bg-white rounded shadow-sm">
                      <div className="text-sm text-gray-500 mb-1">Monthly Total</div>
                      <div className="text-lg font-semibold">${calculateTotals(scenario).monthly.toLocaleString()}</div>
                    </div>
                    <div className="p-4 bg-white rounded shadow-sm">
                      <div className="text-sm text-gray-500 mb-1">Biweekly Total</div>
                      <div className="text-lg font-semibold">${calculateTotals(scenario).biweekly.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default OrgCalculator;

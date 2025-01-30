import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Plus, Minus } from 'lucide-react';

const OrgCalculator = () => {
  const createInitialPosition = (title: string, payType: string) => ({
    title,
    payType,
    pay: 0,
    editable: true
  });

  const initialScenario = {
    director: { 
      title: "Director of Sales", 
      payType: "salary", 
      pay: 0, 
      editable: false,
      payEditable: true
    },
    manager: { 
      title: "Sales Manager", 
      payType: "salary", 
      pay: 0, 
      editable: true 
    },
    reports: [
      createInitialPosition("Account Manager 1", "salary"),
      createInitialPosition("Account Manager 2", "salary"),
      createInitialPosition("Account Manager 3", "salary"),
      createInitialPosition("CSR 1", "hourly"),
      createInitialPosition("CSR 2", "hourly")
    ]
  };

  const [scenarios, setScenarios] = useState({
    1: JSON.parse(JSON.stringify(initialScenario)),
    2: JSON.parse(JSON.stringify(initialScenario)),
    3: JSON.parse(JSON.stringify(initialScenario))
  });

  const calculateAnnual = (pay: number, payType: string) => {
    if (!pay) return 0;
    return payType === 'hourly' ? pay * 2080 : pay;
  };

  const calculateMonthly = (annualPay: number) => annualPay / 12;
  const calculateBiweekly = (annualPay: number) => annualPay / 26;

  const addPosition = (scenarioId: string) => {
    setScenarios(prev => {
      const newScenarios = { ...prev };
      const newPosition = createInitialPosition(`New Position ${newScenarios[scenarioId].reports.length + 1}`, "salary");
      newScenarios[scenarioId].reports.push(newPosition);
      return newScenarios;
    });
  };

  const removePosition = (scenarioId: string, index: number) => {
    setScenarios(prev => {
      const newScenarios = { ...prev };
      newScenarios[scenarioId].reports.splice(index, 1);
      return newScenarios;
    });
  };

  const removeManager = (scenarioId: string) => {
    setScenarios(prev => {
      const newScenarios = { ...prev };
      newScenarios[scenarioId].manager = { title: "", payType: "salary", pay: 0, editable: true };
      return newScenarios;
    });
  };

  const addManager = (scenarioId: string) => {
    setScenarios(prev => {
      const newScenarios = { ...prev };
      newScenarios[scenarioId].manager = createInitialPosition("Sales Manager", "salary");
      return newScenarios;
    });
  };

  const updatePosition = (scenarioId: string, positionIndex: string | number, field: string, value: any) => {
    setScenarios(prev => {
      const newScenarios = { ...prev };
      if (positionIndex === 'director') {
        newScenarios[scenarioId].director[field] = value;
      } else if (positionIndex === 'manager') {
        newScenarios[scenarioId].manager[field] = value;
      } else {
        newScenarios[scenarioId].reports[positionIndex as number][field] = value;
      }
      return newScenarios;
    });
  };

  const calculateTotals = (scenario: any) => {
    let annual = calculateAnnual(scenario.director.pay, scenario.director.payType);
    if (scenario.manager.title) {
      annual += calculateAnnual(scenario.manager.pay, scenario.manager.payType);
    }
    
    scenario.reports.forEach((report: any) => {
      annual += calculateAnnual(report.pay, report.payType);
    });

    return {
      annual,
      monthly: calculateMonthly(annual),
      biweekly: calculateBiweekly(annual)
    };
  };

  const PositionEditor = ({ position, scenarioId, index, onRemove }: any) => {
    return (
      <div className="flex items-center space-x-4 mb-4">
        <input 
          type="text"
          value={position.title}
          onChange={(e) => updatePosition(scenarioId, index, 'title', e.target.value)}
          disabled={!position.editable}
          className={`${position.editable ? 'border' : 'bg-gray-100'} p-2 rounded w-48`}
          placeholder="Position Title"
        />
        <select 
          value={position.payType}
          onChange={(e) => updatePosition(scenarioId, index, 'payType', e.target.value)}
          disabled={!position.editable}
          className={`${position.editable ? 'border' : 'bg-gray-100'} p-2 rounded w-24`}
        >
          <option value="salary">Salary</option>
          <option value="hourly">Hourly</option>
        </select>
        <input 
          type="number"
          value={position.pay}
          onChange={(e) => updatePosition(scenarioId, index, 'pay', parseFloat(e.target.value) || 0)}
          disabled={!position.editable && !position.payEditable}
          placeholder={position.payType === 'hourly' ? 'Hourly rate' : 'Annual salary'}
          className={`${position.editable || position.payEditable ? 'border' : 'bg-gray-100'} p-2 rounded w-32`}
        />
        <div className="space-x-2 flex-grow">
          <span className="text-sm">
            Annual: ${calculateAnnual(position.pay, position.payType).toLocaleString()}
          </span>
          <span className="text-sm">
            Monthly: ${calculateMonthly(calculateAnnual(position.pay, position.payType)).toLocaleString()}
          </span>
          <span className="text-sm">
            Biweekly: ${calculateBiweekly(calculateAnnual(position.pay, position.payType)).toLocaleString()}
          </span>
        </div>
        {onRemove && position.editable && (
          <button
            onClick={onRemove}
            className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded border border-red-200 hover:border-red-300"
            title="Remove position"
          >
            <Minus size={16} />
            <span className="text-sm">Remove</span>
          </button>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Organization Scenarios</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="1">
          <TabsList>
            <TabsTrigger value="1">Scenario 1</TabsTrigger>
            <TabsTrigger value="2">Scenario 2</TabsTrigger>
            <TabsTrigger value="3">Scenario 3</TabsTrigger>
          </TabsList>

          {Object.entries(scenarios).map(([scenarioId, scenario]) => (
            <TabsContent value={scenarioId} key={scenarioId}>
              <div className="space-y-6">
                <PositionEditor 
                  position={scenario.director} 
                  scenarioId={scenarioId} 
                  index="director"
                />
                
                {scenario.manager.title ? (
                  <PositionEditor 
                    position={scenario.manager} 
                    scenarioId={scenarioId} 
                    index="manager"
                    onRemove={() => removeManager(scenarioId)}
                  />
                ) : (
                  <button
                    onClick={() => addManager(scenarioId)}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-4"
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
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                >
                  <Plus size={20} />
                  <span>Add Position</span>
                </button>

                <div className="mt-8 p-4 bg-gray-100 rounded">
                  <h3 className="font-bold mb-2">Scenario {scenarioId} Totals</h3>
                  <div className="space-y-2">
                    <p>Annual Total: ${calculateTotals(scenario).annual.toLocaleString()}</p>
                    <p>Monthly Total: ${calculateTotals(scenario).monthly.toLocaleString()}</p>
                    <p>Biweekly Total: ${calculateTotals(scenario).biweekly.toLocaleString()}</p>
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

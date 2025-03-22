import React from "react";

// Custom tabs implementation
const Tabs = ({ children, defaultValue, value, onValueChange, className }) => {
  const [activeTab, setActiveTab] = React.useState(value || defaultValue);
  
  React.useEffect(() => {
    if (value !== undefined) {
      setActiveTab(value);
    }
  }, [value]);

  const handleTabChange = (newValue) => {
    if (value === undefined) {
      setActiveTab(newValue);
    }
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  // Clone children and provide context
  const childrenWithProps = React.Children.map(children, child => {
    if (!React.isValidElement(child)) return child;

    return React.cloneElement(child, {
      activeTab,
      onTabChange: handleTabChange
    });
  });

  return (
    <div className={className}>
      {childrenWithProps}
    </div>
  );
};

const TabsList = ({ children, className, activeTab, onTabChange }) => {
  return (
    <div className={`flex border-b ${className || ''}`}>
      {React.Children.map(children, child => {
        if (!React.isValidElement(child)) return child;
        
        return React.cloneElement(child, {
          activeTab,
          onTabChange
        });
      })}
    </div>
  );
};

const TabsTrigger = ({ children, value, activeTab, onTabChange, className }) => {
  const isActive = activeTab === value;
  
  return (
    <button
      type="button"
      className={`px-4 py-2 ${isActive ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-blue-500'} ${className || ''}`}
      onClick={() => onTabChange(value)}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ children, value, activeTab, className }) => {
  if (activeTab !== value) return null;
  
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };

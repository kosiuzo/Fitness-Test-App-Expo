/**
 * @fileoverview Agentic coding contracts and type definitions
 * These types ensure AI-friendly code structure and safe modifications
 */

export interface AgenticGuidelines {
  safe_to_modify: string[];
  requires_review: string[];
  ai_patterns: string[];
}

export interface ModuleConfig {
  name: string;
  description: string;
  ai_guidelines: AgenticGuidelines;
  dependencies: string[];
  exports: string[];
}

export interface ServiceContract {
  name: string;
  description: string;
  methods: MethodContract[];
  ai_safe: boolean;
}

export interface MethodContract {
  name: string;
  description: string;
  parameters: ParameterContract[];
  returnType: string;
  throws?: string[];
}

export interface ParameterContract {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

/**
 * @decorator AgenticService
 * Marks a class as safe for AI modification following established patterns
 */
export const AgenticService = (contract: ServiceContract) => {
  return function <T extends new (...args: any[]) => {}>(constructor: T) {
    // Store the contract metadata on the class
    (constructor as any).__agenticContract = contract;
    return constructor;
  };
};

/**
 * @decorator AgenticMethod  
 * Marks a method as safe for AI to extend following the established pattern
 */
export const AgenticMethod = (contract: MethodContract) => {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    if (!target.__agenticMethods) {
      target.__agenticMethods = {};
    }
    target.__agenticMethods[propertyKey] = contract;
    return descriptor;
  };
};
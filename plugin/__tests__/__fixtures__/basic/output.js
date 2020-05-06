const propPath = function (path, property) {
  if (/^[a-zA-Z_$][\w$]*$/.test(property)) {
    return `${path}.${property}`;
  } else if (/^\d$/.test(property)) {
    return `${path}[${property}]`;
  } else {
    return `${path}["${property}"]`;
  }
}; // DO NOT CHANGE THE VARIABLE NAME WITHOUT UPDATING THE PLUGIN CODE


const _will_mutate_check_proxify = (target, options = {}) => {
  // Early return for non-objects
  if (!(target instanceof Object)) return target; // Options

  const {
    deep = false,
    prototype = false
  } = options; // Naming properties for mutation tracing in errors

  let {
    name = typeof target.name === "string" && target.name,
    path = "target"
  } = options;
  if (name !== "undefined" && name !== false) path = propPath(path, name); // If the proxy trap was triggered by the function to test
  // TODO: implement, possibly make optional?

  const triggeredByFunction = true; // Proxy handler

  const handler = {
    // Accessor edge case traps
    getOwnPropertyDescriptor(dummyTarget, prop) {
      /*
      	Early return for cached read-only properties, prevents the below invariant when adding read-only properties to the dummy:
      	"The result of Object.getOwnPropertyDescriptor(target) can be applied to the target object using Object.defineProperty() and will not throw an exception."
      */
      const dummyDescriptor = Reflect.getOwnPropertyDescriptor(...arguments);
      if (dummyDescriptor) return dummyDescriptor; // Reflect using the real target, not the dummy

      const reflectArguments = [...arguments];
      reflectArguments[0] = target;
      const descriptor = Reflect.getOwnPropertyDescriptor(...reflectArguments); // Early return for non-existing properties

      if (!descriptor) return; // If has a value instead of accessors

      const isValueDesc = ("value" in descriptor);

      if (deep) {
        if (isValueDesc) {
          descriptor.value = _will_mutate_check_proxify(descriptor.value, { ...options,
            path,
            name: prop
          });
        } else {// descriptor.set = _will_mutate_check_proxify(descriptor.set, {...options, path, name: prop}); // TODO: apply traps
          // descriptor.get = _will_mutate_check_proxify(descriptor.get, {...options, path, name: prop}); // TODO: apply traps
        }
      } else if (!isValueDesc) {} // descriptor.set = descriptor.set && new Proxy(descriptor.set, descriptorSetHandler); // TODO: apply traps

      /*
      	Add read-only props to `dummyTarget` to meet the below invariant:
      	"A property cannot be reported as existent, if it does not exists as an own property of the target object and the target object is not extensible."
      */


      const isReadOnly = descriptor.writable === false || descriptor.configurable === false;
      if (isReadOnly) Object.defineProperty(dummyTarget, prop, descriptor);
      return descriptor;
    }

  }; // Reflect to the real target for unused traps
  // This is to avoid the navtive fallback to the `dummyTarget`

  const addNoopReflectUsingRealTargetTrap = trap => {
    handler[trap] = function () {
      // Reflect using the real target, not the dummy
      const reflectArguments = [...arguments];
      reflectArguments[0] = target;
      return Reflect[trap](...reflectArguments);
    };
  };

  addNoopReflectUsingRealTargetTrap("isExtensible");
  addNoopReflectUsingRealTargetTrap("has");
  addNoopReflectUsingRealTargetTrap("ownKeys");
  addNoopReflectUsingRealTargetTrap("apply");
  addNoopReflectUsingRealTargetTrap("construct"); // Getting traps for deep mutation assertions

  const addDeepGetTrap = trap => {
    handler[trap] = function (dummyTarget, prop) {
      // Reflect using the real target, not the dummy
      const reflectArguments = [...arguments];
      reflectArguments[0] = target;
      if (trap === "getPrototypeOf") prop = "__proto__";
      const real = Reflect[trap](...reflectArguments);
      return _will_mutate_check_proxify(real, { ...options,
        path,
        name: prop
      });
    };
  };

  deep && addDeepGetTrap("get"); // Covered by getOwnPropertyDescriptor, but is more specific

  prototype && addDeepGetTrap("getPrototypeOf"); // Mutation traps for erroring

  const addSetTrap = trap => {
    handler[trap] = function (dummyTarget, prop) {
      // Reflect using the real target, not the dummy
      const reflectArguments = [...arguments];
      reflectArguments[0] = target; // Naming properties for mutation tracing in errors

      if (trap !== "preventExtensions") {
        if (trap === "setPrototypeOf") prop = "__proto__";
        path += `.${prop}`;
      }

      if (triggeredByFunction) throw new Error(`Mutation assertion failed. \`${trap}\` trap triggered on \`${path}\`.`);
      return Reflect[trap](...reflectArguments);
    };
  };

  addSetTrap("set"); // Covered by defineProperty, but is more specific

  addSetTrap("defineProperty");
  addSetTrap("deleteProperty");
  prototype && addSetTrap("setPrototypeOf");
  addSetTrap("preventExtensions"); // Don't use the true `target` as the proxy target to avoid issues with read-only types
  // Create `dummyTarget` based on the `target`'s constructor

  const dummyTarget = new (Object.getPrototypeOf(target).constructor)();
  return new Proxy(dummyTarget, handler);
};

const global = {
  prop: "test"
};

const foo = foo => {
  const _will_mutate_check_foo = _will_mutate_check_proxify(foo);

  _will_mutate_check_foo.prop = "pie";
};

function bar(foo) {
  const _will_mutate_check_foo = _will_mutate_check_proxify(foo);

  _will_mutate_check_foo.prop = 'Test';
}
/**
 * This does not currently work
 */


const pizza = foo => console.log(foo);

foo(global);
bar(global);

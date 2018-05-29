const Accessor = {
  IDENTITY_FN(input) {
    return input;
  },

  generateAccessor(field) {
    return object => object[field];
  },

  generateOptionToStringFor(prop) {
    if (typeof prop === 'string') {
      return Accessor.generateAccessor(prop);
    } else if (typeof prop === 'function') {
      return prop;
    }
    return Accessor.IDENTITY_FN;
  },

  valueForOption(option, object) {
    if (typeof option === 'string') {
      return object[option];
    } else if (typeof option === 'function') {
      return option(object);
    }
    return object;
  },
};

export default Accessor;

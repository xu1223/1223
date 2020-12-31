const getFormItem = (params, isoffset = false) => {
  const arr = ["xl", "xs"];
  const labelCol = {},
    wrapperCol = {};
  arr.map((item) => {
    labelCol[item] = { span: params[item] };
    wrapperCol[item] = {
      span: 24 - params[item],
      offset: isoffset ? params[item] : 0,
    };
  });
  return {
    labelCol,
    wrapperCol,
  };
};

export const formItemLayout_span6 = {
  labelCol: {
    xs: {
      span: 12,
    },
    sm: {
      span: 12,
    },
    md: {
      span: 12,
    },
    lg: {
      span: 8,
    },
    xl: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 12,
    },
    sm: {
      span: 12,
    },
    md: {
      span: 12,
    },
    lg: {
      span: 16,
    },
    xl: {
      span: 16,
    },
  },
};

export const formItemLayout_span12 = {
  labelCol: {
    xs: {
      span: 6,
    },
    sm: {
      span: 6,
    },
    md: {
      span: 6,
    },
    lg: {
      span: 4,
    },
    xl: {
      span: 4,
    },
  },
  wrapperCol: {
    xs: {
      span: 18,
    },
    sm: {
      span: 18,
    },
    md: {
      span: 18,
    },
    lg: {
      span: 20,
    },
    xl: {
      span: 20,
    },
  },
};

export const formItemLayout_span24 = {
  labelCol: {
    xs: {
      span: 3,
    },
    sm: {
      span: 3,
    },
    md: {
      span: 3,
    },
    lg: {
      span: 2,
    },
    xl: {
      span: 2,
    },
  },
  wrapperCol: {
    xs: {
      span: 21,
    },
    sm: {
      span: 21,
    },
    md: {
      span: 21,
    },
    lg: {
      span: 22,
    },
    xl: {
      span: 22,
    },
  },
};

export const formItemLayout_span7 = {
  labelCol: {
    xs: {
      span: 9,
    },
    sm: {
      span: 9,
    },
    md: {
      span: 9,
    },
    lg: {
      span: 9,
    },
    xl: {
      span: 9,
    },
  },
  wrapperCol: {
    xs: {
      span: 15,
    },
    sm: {
      span: 15,
    },
    md: {
      span: 15,
    },
    lg: {
      span: 15,
    },
    xl: {
      span: 15,
    },
  },
};
export const formItemLayout_span21 = {
  labelCol: {
    xs: {
      span: 4,
    },
    sm: {
      span: 4,
    },
    md: {
      span: 4,
    },
    lg: {
      span: 3,
    },
    xl: {
      span: 3,
    },
  },
  wrapperCol: {
    xs: {
      span: 20,
    },
    sm: {
      span: 20,
    },
    md: {
      span: 20,
    },
    lg: {
      span: 21,
    },
    xl: {
      span: 21,
    },
  },
};
export const formItemLayout_span13 = {
  labelCol: {
    xs: {
      span: 12,
    },
    sm: {
      span: 24,
    },
    md: {
      span: 12,
    },
    lg: {
      span: 6,
    },
    xl: {
      span: 6,
    },
  },
  wrapperCol: {
    xs: {
      span: 12,
    },
    sm: {
      span: 24,
    },
    md: {
      span: 12,
    },
    lg: {
      span: 18,
    },
    xl: {
      span: 18,
    },
  },
};
// export const formItemLayout1 = getFormItem({xl:4,xs:5})

// export const formItemLayout2 = getFormItem({xl:2,xs:3})

export const formItemLayout_l = getFormItem({ xl: 8, xs: 10 }, true);

export const formItemLayout1_l = getFormItem({ xl: 4, xs: 5 }, true);

export const formItemLayout2_l = getFormItem({ xl: 2, xs: 3 }, true);

export const formItemLayout1 = {
  labelCol: {
    xs: {
      span: 8,
    },
    sm: {
      span: 8,
    },
    md: {
      span: 8,
    },
    lg: {
      span: 6,
    },
    xl: {
      span: 6,
    },
  },
  wrapperCol: {
    xs: {
      span: 16,
    },
    sm: {
      span: 16,
    },
    md: {
      span: 16,
    },
    lg: {
      span: 18,
    },
    xl: {
      span: 18,
    },
  },
};

export const formItemLayout2 = {
  labelCol: {
    xs: {
      span: 8,
    },
    sm: {
      span: 8,
    },
    md: {
      span: 6,
    },
    lg: {
      span: 4,
    },
    xl: {
      span: 3,
    },
  },
  wrapperCol: {
    xs: {
      span: 16,
    },
    sm: {
      span: 16,
    },
    md: {
      span: 18,
    },
    lg: {
      span: 20,
    },
    xl: {
      span: 21,
    },
  },
};
export const formItemLayout3 = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};
export const formItemLayout4 = {
  labelCol: {
    xs: {
      span: 4,
    },
    sm: {
      span: 4,
    },
    md: {
      span: 4,
    },
    lg: {
      span: 3,
    },
    xl: {
      span: 3,
    },
  },
  wrapperCol: {
    xs: {
      span: 20,
    },
    sm: {
      span: 20,
    },
    md: {
      span: 20,
    },
    lg: {
      span: 21,
    },
    xl: {
      span: 21,
    },
  },
};
export const formItemLayout5 = {
  labelCol: {
    xs: {
      span: 11,
    },
    sm: {
      span: 11,
    },
    md: {
      span: 11,
    },
    lg: {
      span: 9,
    },
    xl: {
      span: 9,
    },
  },
  wrapperCol: {
    xs: {
      span: 13,
    },
    sm: {
      span: 13,
    },
    md: {
      span: 13,
    },
    lg: {
      span: 15,
    },
    xl: {
      span: 15,
    },
  },
};
export const formItemLayout6 = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 21,
  },
};
export const formItemLayout7 = {
  labelCol: {
    xs: {
      span: 11,
    },
    sm: {
      span: 11,
    },
    md: {
      span: 11,
    },
    lg: {
      span: 12,
    },
    xl: {
      span: 12,
    },
  },
  wrapperCol: {
    xs: {
      span: 13,
    },
    sm: {
      span: 13,
    },
    md: {
      span: 13,
    },
    lg: {
      span: 12,
    },
    xl: {
      span: 12,
    },
  },
};
export const formItemLayout8 = {
  labelCol: {
    xs: {
      span: 4,
    },
    sm: {
      span: 4,
    },
    md: {
      span: 4,
    },
    lg: {
      span: 2,
    },
    xl: {
      span: 2,
    },
  },
  wrapperCol: {
    xs: {
      span: 20,
    },
    sm: {
      span: 20,
    },
    md: {
      span: 20,
    },
    lg: {
      span: 22,
    },
    xl: {
      span: 22,
    },
  },
};
export const formItemLayout9 = {
  labelCol: {
    xs: {
      span: 8,
    },
    sm: {
      span: 8,
    },
    md: {
      span: 6,
    },
    lg: {
      span: 5,
    },
    xl: {
      span: 4,
    },
  },
  wrapperCol: {
    xs: {
      span: 16,
    },
    sm: {
      span: 16,
    },
    md: {
      span: 18,
    },
    lg: {
      span: 19,
    },
    xl: {
      span: 18,
    },
  },
};
export const formItemLayout10 = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

export const formItemLayout14 = {
	labelCol: { span: 4 },
	wrapperCol: { span: 20 },
  };
  export const formItemLayout15 = {
	labelCol: { span: 5 },
	wrapperCol: { span: 19 },
  };
  export const formItemLayout16 = {
	labelCol: {
	  xs: { span: 24 },
	  sm: { span: 5 },
	},
	wrapperCol: {
	  xs: { span: 24 },
	  sm: { span: 19 },
	},
  };
  export const formItemLayout17 = {
	labelCol: {
	  xs: {
		span: 12,
	  },
	  sm: {
		span: 12,
	  },
	  md: {
		span: 12,
	  },
	  lg: {
		span: 9,
	  },
	  xl: {
		span: 7,
	  },
	},
	wrapperCol: {
	  xs: {
		span: 12,
	  },
	  sm: {
		span: 12,
	  },
	  md: {
		span: 12,
	  },
	  lg: {
		span: 15,
	  },
	  xl: {
		span: 17,
	  },
	},
  };
  export const formItemLayout24 = {
	labelCol: {
	  xs: { span: 24 },
	  sm: { span: 0 },
	},
	wrapperCol: {
	  xs: { span: 24 },
	  sm: { span: 24 },
	},
  };
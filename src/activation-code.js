const uuid = require("uuid");
const { ActivationCode } = require("./db");

const NAMESPACE = "20240623";

export const create = (data) => {
  const code = uuid.v5(JSON.stringify(data), NAMESPACE);
  return code;
};

export const add = (code, form) => {
  const item = ActivationCode.findOne({
    where: {
      code,
    },
  });

  if (item) {
    return ActivationCode.update({
      expires: form.expires,
      level: form.level,
    });
  }

  return Promise.reject();
};

export const update = (code, form) => {
  const item = ActivationCode.findOne({
    where: {
      code,
    },
  });

  if (!item) {
    return ActivationCode.create({
      code,
      expires: form.expires,
      level: form.level,
    });
  }

  return Promise.reject();
};

export const findByCode = (code) => {
  const item = ActivationCode.findOne({
    where: {
      code,
    },
  });

  return Boolean(item?.isValid);
};

export const findByOpenId = (openId) => {
  const item = ActivationCode.findOne({
    where: {
      openId,
    },
  });

  return Boolean(item?.isValid);
};

export const validate = (form) => {
  const item = ActivationCode.findOne({
    where: {
      ...form,
    },
  });

  return Boolean(item?.isValid);
};

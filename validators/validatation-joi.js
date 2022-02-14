const { celebrate, Joi } = require('celebrate');

// При регистрации
const validateSignupRoute = celebrate({
  body: Joi.object().keys({
    name: Joi
      .string()
      .required()
      .min(2)
      .max(30)
      .messages({
        'string.empty': 'Поле с именем не должно быть пустым',
        'any.required': 'Поле имя является обязательным',
        'string.min': 'Имя не должно быть меньше 2-х символов',
        'string.max': 'Имя не должно быть больше 30-и символов',
      }),
    email: Joi
      .string()
      .required()
      .email()
      .messages({
        'string.empty': 'Поле email не должно быть пустым',
        'any.required': 'Поле email является обязательным',
        'string.email': 'Введённый email не соответствует формату',
      }),
    password: Joi
      .string()
      .required()
      .messages({
        'string.empty': 'Поле с паролем не должно быть пустым',
        'any.required': 'Поле с паролем является обязательным',
      }),
  }),
});

// При авторизации
const validateSigninRoute = celebrate({
  body: Joi.object().keys({
    email: Joi
      .string()
      .required()
      .email()
      .messages({
        'string.empty': 'Поле email не должно быть пустым',
        'any.required': 'Поле email является обязательным',
        'string.email': 'Введённый email не соответствует формату',
      }),
    password: Joi
      .string()
      .required()
      .messages({
        'string.empty': 'Поле с паролем не должно быть пустым',
        'any.required': 'Поле с паролем является обязательным',
      }),
  }),
});

// При обновлении информации о пользователе
const validateUpdateUserInfoRoute = celebrate({
  body: Joi.object().keys({
    name: Joi
      .string()
      .required()
      .min(2)
      .max(30)
      .messages({
        'string.empty': 'Поле с именем не должно быть пустым',
        'any.required': 'Поле имя является обязательным',
        'string.min': 'Имя не должно быть меньше 2-х символов',
        'string.max': 'Имя не должно быть больше 30-и символов',
      }),
    email: Joi
      .string()
      .required()
      .email()
      .messages({
        'string.empty': 'Поле email не должно быть пустым',
        'any.required': 'Поле email является обязательным',
        'string.email': 'Введённый email не соответствует формату',
      }),
  }),
});

// При удалении карточки
const validateDeleteMovieRoute = celebrate({
  params: Joi.object().keys({
    movieId: Joi
      .string()
      .length(24)
      .hex()
      .required()
      .messages({
        'string.empty': 'Передан пустой идентификатор',
        'any.required': 'Идентификатор фильма является обязательным значением',
        'string.length': 'Идентификатор должен состоять из 24-х символов',
        'string.hex': 'Идентификатор должен состоять только из шестнадцатиричных символов',
      }),
  }),
});

// При создании карточки
const validateCreateMovieRoute = celebrate({
  body: Joi.object().keys({
    country: Joi
      .string()
      .required()
      .messages({
        'string.empty': 'Поле Страна не должно быть пустым',
        'any.required': 'Поле Страна является обязательным',
      }),
    director: Joi
      .string()
      .required()
      .messages({
        'string.empty': 'Поле Режиссёр не должно быть пустым',
        'any.required': 'Поле Режиссёр является обязательным',
      }),
    duration: Joi
      .number()
      .required()
      .messages({
        'number.base': 'Поле Длительность должно быть числом',
        'number.empty': 'Поле Длительность не должно быть пустым',
        'any.required': 'Поле Длительность является обязательным',
      }),
    year: Joi
      .string()
      .required()
      .messages({
        'string.empty': 'Поле Год производства не должно быть пустым',
        'any.required': 'Поле Год производства является обязательным',
      }),
    description: Joi
      .string()
      .required()
      .messages({
        'string.empty': 'Поле Описание не должно быть пустым',
        'any.required': 'Поле Описание является обязательным',
      }),
    image: Joi
      .string()
      .required()
      .pattern(/https?:\/\/(www\.)?[\w-]+\.[\w]{2,}[\w\W]*/)
      .messages({
        'string.pattern.base': 'Ссылка на постер не соответствует формату',
        'string.empty': 'Поле Ссылка на постер не должно быть пустым',
        'any.required': 'Поле Ссылка на постер является обязательным',
      }),
    trailerLink: Joi
      .string()
      .required()
      .pattern(/https?:\/\/(www\.)?[\w-]+\.[\w]{2,}[\w\W]*/)
      .messages({
        'string.pattern.base': 'Ссылка на трейлер не соответствует формату',
        'string.empty': 'Поле Ссылка на трейлер не должно быть пустым',
        'any.required': 'Поле Ссылка на трейлер является обязательным',
      }),
    thumbnail: Joi
      .string()
      .required()
      .pattern(/https?:\/\/(www\.)?[\w-]+\.[\w]{2,}[\w\W]*/)
      .messages({
        'string.pattern.base': 'Ссылка на мини-постер не соответствует формату',
        'string.empty': 'Поле Ссылка на мини-постер не должно быть пустым',
        'any.required': 'Поле Ссылка на мини-постер является обязательным',
      }),
    nameRU: Joi
      .string()
      .required()
      .messages({
        'string.empty': 'Поле с Названием фильма на русском языке не должно быть пустым',
        'any.required': 'Поле с Названием фильма на русском языке является обязательным',
      }),
    nameEN: Joi
      .string()
      .required()
      .messages({
        'string.empty': 'Поле с Названием фильма на английском языке не должно быть пустым',
        'any.required': 'Поле с Названием фильма на английском языке является обязательным',
      }),
    movieId: Joi
      .number()
      .required()
      .messages({
        'number.base': 'Идентификатор фильма должен быть числом',
        'number.empty': 'Передан пустой идентификатор фильма',
        'any.required': 'Идентификатор фильма является обязательным значением',
      }),
  }),
});

module.exports = {
  validateSignupRoute,
  validateSigninRoute,
  validateUpdateUserInfoRoute,
  validateDeleteMovieRoute,
  validateCreateMovieRoute,
};

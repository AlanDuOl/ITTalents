"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workingShifts = exports.dailyWorkingHours = exports.redirectMessage = exports.redirectCode = exports.errorType = exports.validationMessage = exports.profileSession = exports.uiPath = exports.apiPath = void 0;
exports.apiPath = {
    technologies: "api/Technology",
    daylyWorkingHours: "api/DailyWorkingHours",
    workingShifts: "api/WorkingShifts",
    professionalInformation: "api/ProfessionalInformation",
    error: "api/error",
    profile: {
        create: "api/User/Create",
        update: "api/User/Update",
        get: "api/User/Get",
        delete: "api/User/Delete",
        getRoles: "api/User/GetRoles"
    },
    admin: {
        list: "api/Admin/List",
        get: "api/Admin/Get",
    },
};
exports.uiPath = {
    profiles: {
        details: '/profiles/details',
        create: '/profiles/create',
        update: '/profiles/update',
        result: '/profiles/result'
    },
    admin: {
        listProfiles: '/admin/profiles',
        profileDetails: '/admin/details'
    },
    error: '/error',
    base: '/'
};
exports.profileSession = {
    item: 'hasProfile',
    value: '1'
};
exports.validationMessage = {
    required: "Field required",
    email: "Not a valid email",
    pattern: "Not a valid number",
    maxlength: "Limit of characters exceeded"
};
exports.errorType = {
    nullArgument: "NullArgument",
    nullReference: "NullReference",
    observable: "ObservableError",
    builtIn: "Built-In",
    appException: "appException"
};
exports.redirectCode = {
    notFound: 1,
    forbid: 2,
    serverError: 3,
    success: 4,
    notAllowed: 5,
    unexpected: 6,
    hasProfile: 7,
    noProfile: 8,
};
exports.redirectMessage = {
    "1": "Not found",
    "2": "Access forbiden",
    "3": "Internal server error",
    "4": "Request processed successfully",
    "5": "Not allowed",
    "6": "Unexpected error",
    "7": "You alrady have a profile",
    "8": "You don't have a profile",
};
exports.dailyWorkingHours = {
    "Up to 4": {
        name: "daily1",
        label: "Up to 4 hours per day / Até 4 horas por dia",
    },
    "4 to 6": {
        name: "daily2",
        label: "4 to 6 hours per day / De 4 á 6 horas por dia",
    },
    "6 to 8": {
        name: "daily3",
        label: "6 to 8 hours per day /De 6 á 8 horas por dia",
    },
    "Over 8": {
        name: "daily4",
        label: "Up to 8 hours a day (are you sure?) / Acima de 8 horas por dia (tem certeza?)",
    },
    "Weekends": {
        name: "weekend",
        label: "Only weekends / Apenas finais de semana",
    }
};
exports.workingShifts = {
    "Morning": {
        label: "Morning (from 08:00 to 12:00) / Manhã (de 08:00 ás 12:00)",
    },
    "Afternoon": {
        label: "Afternoon (from 1:00 p.m. to 6:00 p.m.) / Tarde (de 13:00 ás 18:00)",
    },
    "Night": {
        label: "Night (7:00 p.m. to 10:00 p.m.) /Noite (de 19:00 as 22:00)",
    },
    "Dawn": {
        label: "Dawn (from 10 p.m. onwards) / Madrugada (de 22:00 em diante)",
    },
    "Business": {
        label: "Business (from 08:00 a.m. to 06:00 p.m.) / Comercial (de 08:00 as 18:00)",
    }
};
//# sourceMappingURL=constants.js.map
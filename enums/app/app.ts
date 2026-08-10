export enum Routes {
    BANK_LOGIN = '/playwright/tta-bank/index.html',
    BANK_REGISTER = '/playwright/tta-bank/register.html',
    BANK_DASHBOARD = '/playwright/tta-bank/dashboard.html',
    BANK_SEND = '/playwright/tta-bank/send.html',
}

export enum ApiEndpoints {
    ORDERS = '/playwright/api/orders.json',
}

export enum StorageStatePaths {
    APP = '.auth/app.json',
    USER = '.auth/user.json',
}

export enum Messages {
    LOGIN_ERROR = 'Invalid email or password',
}

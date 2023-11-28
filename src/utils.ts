export const copy = (obj: any) => {
    if (typeof obj !== "object" || obj === null) {
        return obj;
    }
    const deepCopyObj: Record<string, any> = {};
    for (let key in obj) {
        deepCopyObj[key] = copy(obj[key]);
    }
    return deepCopyObj;
};

export const sleep = async (ms: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};

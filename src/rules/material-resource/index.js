import { i18n } from "@/utils/i18n.js"
import { MAX_CHARACTER, MAX_DESCRIPTION } from "@/constants/application.js"

export const MATERIAL_RULES = {
    licensePlate: [
        { required: true, message: i18n.global.t("E-MACH-001"), trigger: "blur" },
        {
            max: MAX_CHARACTER,
            message: i18n.global.t("E-CM-003", { max: MAX_CHARACTER }),
            trigger: "change",
        },
    ],
    brand: [
        { required: true, message: i18n.global.t("E-MACH-002"), trigger: "blur" },
        {
            max: MAX_CHARACTER,
            message: i18n.global.t("E-CM-003", { max: MAX_CHARACTER }),
            trigger: "change",
        },
    ],
    yearOfManufacture: [
        { required: true, message: i18n.global.t("E-MACH-003"), trigger: "blur" },
        {
            type: "number",
            message: i18n.global.t("E-MACH-004"),
            trigger: "change",
        },
    ],
    countryOfManufacture: [
        {
            max: MAX_CHARACTER,
            message: i18n.global.t("E-CM-003", { max: MAX_CHARACTER }),
            trigger: "change",
        },
    ],
    vehicleType: [{ required: true, message: i18n.global.t("E-MACH-005"), trigger: "blur" }],
    chassisNumber: [
        { required: true, message: i18n.global.t("E-MACH-006"), trigger: "blur" },
        {
            max: MAX_CHARACTER,
            message: i18n.global.t("E-CM-003", { max: MAX_CHARACTER }),
            trigger: "change",
        },
    ],
    engineNumber: [
        { required: true, message: i18n.global.t("E-MACH-007"), trigger: "blur" },
        {
            max: MAX_CHARACTER,
            message: i18n.global.t("E-CM-003", { max: MAX_CHARACTER }),
            trigger: "change",
        },
    ],
    image: [{ required: true, message: i18n.global.t("E-MACH-008"), trigger: "blur" }],
    status: [{ required: true, message: i18n.global.t("E-MACH-009"), trigger: "blur" }],
    driver: [{ required: true, message: i18n.global.t("E-MACH-010"), trigger: "blur" }],
    color: [
        {
            max: MAX_CHARACTER,
            message: i18n.global.t("E-CM-003", { max: MAX_CHARACTER }),
            trigger: "change",
        },
    ],
    fuelType: [
        { required: true, message: i18n.global.t("E-MACH-011"), trigger: "blur" },
        {
            max: MAX_CHARACTER,
            message: i18n.global.t("E-CM-003", { max: MAX_CHARACTER }),
            trigger: "change",
        },
    ],
    description: [
        {
            max: MAX_DESCRIPTION,
            message: i18n.global.t("E-CM-003", { max: MAX_DESCRIPTION }),
            trigger: "change",
        },
    ],
    fuelTankVolume: [
        { required: true, message: i18n.global.t("E-MACH-012"), trigger: "blur" },
        {
            type: "number",
            message: i18n.global.t("E-MACH-013"),
            trigger: "change",
        },
    ],
    fuelUnit: [
        { required: true, message: i18n.global.t("E-MACH-014"), trigger: "blur" },
        {
            max: MAX_CHARACTER,
            message: i18n.global.t("E-CM-003", { max: MAX_CHARACTER }),
            trigger: "change",
        },
    ],
    attachment: [],
}


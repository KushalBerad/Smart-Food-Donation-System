// Lucide Icons

import {
    Building2,
    FileText,
    Lock,
    Mail,
    MapPin,
    Phone,
    Upload,
    User,
} from "lucide-react";

// Color Constants

export const GREEN = "#1f9d55";
export const GREEN_DARK = "#188046";
export const GREEN_LIGHT = "#e8f7ee";
export const BORDER = "#dfe5e1";
export const BORDER_ERROR = "#e39a9a";
export const BG_ERROR = "#fef6f6";
export const NOTE_BORDER = "#c9ebd6";
export const NOTE_TEXT = "#3a5c47";
export const TEXT_MUTED = "#6b7a72";
export const TEXT_DARK = "#16241c";
export const TEXT_LABEL = "#2b3a32";
export const TEXT_ERROR = "#d34b4b";
export const ICON_MUTED = "#7a8a80";
export const INPUT_BG = "#fafcfb";
export const TAB_BG = "#f0f3f1";
export const PAGE_BG = "#f4f7f5";

// Registration Form Configuration

export const FIELD_CONFIG = {
    donor: {
        title: "Donor Registration",
        subtitle: "Create your donor account",
        fields: [
            {
                name: "fullName",
                label: "Full Name",
                placeholder: "Enter your full name",
                icon: User,
                required: true,
                span: 1
            },
            {
                name: "phone",
                label: "Phone Number",
                placeholder: "Enter 10 digit mobile number",
                icon: Phone,
                required: true,
                span: 1,
                type: "tel"
            },
            {
                name: "email",
                label: "Email Address",
                placeholder: "Enter your email address",
                icon: Mail,
                required: true,
                span: 2,
                type: "email"
            },
            {
                name: "password",
                label: "Password",
                placeholder: "Enter password",
                icon: Lock,
                required: true,
                span: 1,
                type: "password"
            },
            {
                name: "confirmPassword",
                label: "Confirm Password",

                placeholder: "Confirm password",
                icon: Lock,
                required: true,
                span: 1,
                type: "password"
            },
            {
                name: "city",
                label: "City",
                placeholder: "Enter your city",
                icon: MapPin,
                required: true,
                span: 1
            },
            {
                name: "orgName",
                label: "Organization Name (Optional)",
                placeholder: "e.g. Your Organization / Restaurant / Group",
                icon: Building2,
                required: false,
                span: 1
            },
        ],
        note: "Organization name is optional. Individuals can register without it.",
    },
    ngo: {
        title: "NGO Registration",
        subtitle: "Create your NGO account",
        fields: [

            {
                name: "ngoName",
                label: "NGO Name",
                placeholder: "Enter NGO name",
                icon: Building2, required: true, span: 1
            },
            {
                name: "regNumber",
                label: "Registration Number",
                placeholder: "Enter registration number",
                icon: FileText,
                required: true,
                span: 1
            },
            {
                name: "contactPerson",
                label: "Contact Person",
                placeholder: "Enter contact person name",
                icon: User,
                required: true, span: 1
            },
            {
                name: "phone",
                label: "Phone Number",
                placeholder: "Enter 10 digit mobile number",
                icon: Phone,
                required: true,
                span: 1, type: "tel"
            },
            {
                name: "email",
                label: "Email Address",
                placeholder: "Enter your email address",
                icon: Mail,
                required: true,
                span: 2,
                type: "email"
            },
            {
                name: "password",
                label: "Password",
                placeholder: "Enter password",
                icon: Lock, required: true,
                span: 1, type: "password"
            },
            {
                name: "confirmPassword",
                label: "Confirm Password",
                placeholder: "Confirm password",
                icon: Lock, required: true,
                span: 1,
                type: "password"
            },
            {
                name: "city",
                label: "City",
                placeholder: "Enter your city",
                icon: MapPin,
                required: true,
                span: 1
            },
            {
                name: "verificationDoc",
                label: "Verification Document",
                placeholder: "Upload registration certificate / NGO document",
                icon: Upload, required: true,
                span: 2,
                type: "file"
            },
        ],
        note: null,
    },
};
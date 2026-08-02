// Default landing page per role after login (admin sees the chat/customer dashboard).
export const ROLE_HOME = {
    admin: '/home',
    staff_logistic: '/logistics',
    staff_design: '/form-bookings',
    staff_operasional: '/logistics',
};

export function roleHome(role) {
    return ROLE_HOME[role] ?? '/login';
}

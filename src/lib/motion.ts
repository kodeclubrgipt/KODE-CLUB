export const SPRING_CONFIG = {
    type: "spring",
    damping: 20,
    stiffness: 100,
};

export const TRANSITION_EASE = [0.22, 1, 0.36, 1];

export const STAGGER_CHILD_VARIANTS = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            damping: 20,
            stiffness: 100
        }
    },
};

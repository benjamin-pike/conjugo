import { faArrowRightFromBracket, faGear, faQuestion, faUser } from '@fortawesome/free-solid-svg-icons'

const dropdownItems = [
    {
        key: 2,
        text: 'Settings',
        icon: faGear,
        function: 'settings',
        onClick: () => {}
    },
    {
        key: 3,
        text: 'Help',
        icon: faQuestion,
        function: 'help',
        onClick: () => {}
    },
    {
        key: 4,
        text: 'Log Out',
        icon: faArrowRightFromBracket,
        function: 'log_out',
        onClick: () => {}
    },
]

export default dropdownItems;
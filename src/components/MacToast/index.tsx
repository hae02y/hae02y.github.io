export default MacToast = () => {

    return(
        <Toast.Root type="background">
            <Toast.Title>Upgrade Available!</Toast.Title>
            <Toast.Description>We've just released Radix 1.0.</Toast.Description>
            <Toast.Action altText="Goto account settings to upgrade">
                Upgrade
            </Toast.Action>
            <Toast.Close>Dismiss</Toast.Close>
        </Toast.Root>
    )
}

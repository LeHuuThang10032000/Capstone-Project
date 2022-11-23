<div class="fixed">
    <aside aria-label="Sidebar" style="width: 13rem; overflow: hidden;">
        <div class="overflow-y-auto px-3 bg-nav min-h-screen">
            <ul class="space-y-2">
                <li>
                    <a href="#" class="flex items-center p-3 text-base font-normal hover:bg-theme dark:hover:bg-gray-700">
                        <img src="{{ asset('img/dashboard.png') }}" alt="#" style="vertical-align:middle">
                        <span class="ml-3">Dashboard</span>
                    </a>
                </li>
                <li>
                    <a href="#" class="flex items-center p-3 text-base font-normal hover:bg-theme dark:hover:bg-gray-700">
                        <img src="{{ asset('img/account.png') }}" alt="#">
                        <span class="flex-1 ml-3 whitespace-nowrap">Accounts</span>
                    </a>
                </li>
                <li>
                    <a href="#" class="flex items-center p-3 text-base font-normal hover:bg-theme dark:hover:bg-gray-700">
                        <img src="{{ asset('img/role.png') }}" alt="#">
                        <span class="flex-1 ml-3 whitespace-nowrap">Roles</span>
                    </a>
                </li>
                <li>
                    <a href="#" class="flex items-center p-3 text-base font-normal hover:bg-theme dark:hover:bg-gray-700">
                        <img src="{{ asset('img/wallet.png') }}" alt="#">
                        <span class="flex-1 ml-3 whitespace-nowrap">Wallets</span>
                    </a>
                </li>
                <li>
                    <a href="#" class="flex items-center p-3 text-base font-normal hover:bg-theme dark:hover:bg-gray-700">
                        <img src="{{ asset('img/transaction.png') }}" alt="#">
                        <span class="flex-1 ml-3 whitespace-nowrap">Transactions</span>
                    </a>
                </li>
                <li>
                    <a href="#" class="flex items-center p-3 text-base font-normal hover:bg-theme dark:hover:bg-gray-700">
                        <img src="{{ asset('img/service.png') }}" alt="#">
                        <span class="flex-1 ml-3 whitespace-nowrap">Services</span>
                    </a>
                </li>
                <li>
                    <a href="#" class="flex items-center p-3 text-base font-normal hover:bg-theme dark:hover:bg-gray-700">
                        <img src="{{ asset('img/setting.png') }}" alt="#">
                        <span class="flex-1 ml-3 whitespace-nowrap">Settings</span>
                    </a>
                </li>
                <li>
                    <a href="#" class="flex items-center p-3 text-base font-normal hover:bg-theme dark:hover:bg-gray-700">
                        <img src="{{ asset('img/offer.png') }}" alt="#"> 
                        <span class="flex-1 ml-3 whitespace-nowrap">Offers</span>
                    </a>
                </li>
                <li>
                    <a href="#" class="flex items-center p-3 text-base font-normal hover:bg-theme dark:hover:bg-gray-700">
                        <img src="{{ asset('img/notification.png') }}" alt="#">
                        <span class="flex-1 ml-3 whitespace-nowrap">Notifications</span>
                    </a>
                </li>
                <div class="absolute w-full" style="bottom: 0; padding-bottom: 2.5rem">
                    <form method="POST" action="{{ route('logout') }}">
                        @csrf
                        <a href="" class="flex justify-end items-center p-3 text-base font-normal hover:bg-theme dark:hover:bg-gray-700" onclick="event.preventDefault(); this.closest('form').submit();">
                            <img src="{{ asset('img/logout.png') }}" alt="#" style="vertical-align:middle">
                            <span class="flex-1 ml-3 whitespace-nowrap">Logout</span>
                        </a>
                    </form>
                </div>
            </ul>
        </div>
    </aside>
</div>

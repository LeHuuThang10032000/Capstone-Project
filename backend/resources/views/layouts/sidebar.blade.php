<div class="fixed" style="top: 0; bottom: 0; left: 0; padding-top: 50px; width: 13rem; overflow: hidden;">

    <div class="overflow-y-auto bg-nav min-h-screen">
        <ul class="p-0">
            <li>
                <a href="{{ route('dashboard') }}"
                   class="flex items-center p-3 hover:bg-theme {{ Request::is('dashboard') ? 'active' : '' }}">
                    <img src="{{ asset('img/dashboard.png') }}" alt="#">
                    <span class="ml-3">Trang chủ</span>
                </a>
            </li>
            <li>
                <a href="{{ route('user.index') }}"
                   class="flex items-center p-3 hover:bg-theme {{ Request::is('user') ? 'active' : '' }}">
                    <img src="{{ asset('img/account.png') }}" alt="#">
                    <span class="flex-1 ml-3 whitespace-nowrap">Người dùng</span>
                </a>
            </li>
            <li>
                <a id="drop-down" class="flex items-center p-3 hover:bg-theme" data-bs-toggle="collapse"
                   href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
                    <img src="{{ asset('img/request.png') }}" alt="#">
                    <span class="flex-1 ml-3 whitespace-nowrap">Yêu cầu</span>
                </a>
                <div class="collapse" id="collapseExample">
                    <ul class="p-0">
                        <li>
                            <a class="flex items-center py-3 hover:bg-theme {{ Request::is('store-request') ? 'active' : '' }}"
                               href="{{ route('organiser.store-request') }}" style="padding-left: 2rem;">Mở cửa hàng</a>
                        </li>
                        <li>
                            <a class="flex items-center py-3 hover:bg-theme {{ Request::is('credit-request') ? 'active' : '' }}"
                               href="{{ route('organiser.credit-request.index') }}" style="padding-left: 2rem;">Mở tín
                                dụng</a></li>
                        <li>
                            <a class="flex items-center py-3 hover:bg-theme {{ Request::is('withdraw-request') ? 'active' : '' }}"
                               href="{{route('organiser.withdraw-request.index')}}" style="padding-left: 2rem;">Rút
                                tiền</a></li>
                    </ul>
                </div>
            </li>
            <li>
                <a href="{{ route('organiser.wallet.index') }}"
                   class="flex items-center p-3 hover:bg-theme {{ Request::is('wallet') ? 'active' : '' }}">
                    <img src="{{ asset('img/wallet.png') }}" alt="#">
                    <span class="flex-1 ml-3 whitespace-nowrap">Ví</span>
                </a>
            </li>
            <li>
                <a href=""
                   class="flex items-center p-3 hover:bg-theme {{ Request::is('transaction') ? 'active' : '' }}">
                    <img src="{{ asset('img/transaction.png') }}" alt="#">
                    <span class="flex-1 ml-3 whitespace-nowrap">Giao dịch</span>
                </a>
            </li>
            <li>
                <a href="" class="flex items-center p-3 hover:bg-theme {{ Request::is('setting') ? 'active' : '' }}">
                    <img src="{{ asset('img/setting.png') }}" alt="#">
                    <span class="flex-1 ml-3 whitespace-nowrap">Settings</span>
                </a>
            </li>
            <li>
                <a href="#" class="flex items-center p-3 hover:bg-theme {{ Request::is('offer') ? 'active' : '' }}">
                    <img src="{{ asset('img/offer.png') }}" alt="#">
                    <span class="flex-1 ml-3 whitespace-nowrap">Offers</span>
                </a>
            </li>
            <div class="absolute w-full" style="bottom: 0;">
                <form method="POST" action="{{ route('logout') }}">
                    @csrf
                    <a href="" class="flex justify-end items-center p-3 text-base font-normal hover:bg-theme"
                       onclick="event.preventDefault(); this.closest('form').submit();">
                        <img src="{{ asset('img/logout.png') }}" alt="#" style="vertical-align:middle">
                        <span class="flex-1 ml-3 whitespace-nowrap">Đăng xuất</span>
                    </a>
                </form>
            </div>
        </ul>
    </div>

</div>

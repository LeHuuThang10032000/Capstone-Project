<x-guest-layout>
    <x-auth-card>
        <x-slot name="logo">
            <a href="/">
                <x-application-logo />
            </a>

            <h1 class="text-3xl text-white">VLPay e-wallet</h1>
        </x-slot>

        <!-- Session Status -->
        <x-auth-session-status class="mb-4" :status="session('status')" />

        <!-- Validation Errors -->
        <x-auth-validation-errors class="mb-4" :errors="$errors" />

        <form method="POST" action="{{ route('login') }}">
            @csrf

            <!-- Email Address -->
            <div>
                <x-label for="phone" :value="__('Số điện thoại')" />

                <x-input id="phone" class="block mt-1 w-full" style="border-color: #FFDAC0" type="text" name="phone" :value="old('phone')" required autofocus />
            </div>

            <!-- Password -->
            <div class="mt-4">
                <x-label for="password" :value="__('Mật khẩu')" />

                <x-input id="password" class="block mt-1 w-full" style="border-color: #FFDAC0"
                                type="password"
                                name="password"
                                required autocomplete="current-password" />
            </div>

            <div class="flex items-center justify-end mt-4">
                <x-button style="width: 100%; background-color: #B5EAD8; border-color: #000000">
                    Đăng nhập
                </x-button>
            </div>
        </form>
    </x-auth-card>
</x-guest-layout>

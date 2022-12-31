<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>@yield('title') VL e-wallet</title>

    <!-- Fonts -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap">

    <!-- Styles -->
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
    <!-- Scripts -->
    <script src="{{ asset('js/app.js') }}" defer></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
</head>

<body class="font-sans antialiased" style="background-color: rgba(199, 206, 234, 0.3)">
    @include('layouts.navigation')
    @include('layouts.sidebar')

    <div style="margin-left: 208px; padding-top: 52px">
        @yield('content')
    </div>

    @if(session()->has('success'))
    <div class="modal fade" id="messageModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content align-center" style="height: 290px;">
                <img src="{{ asset('img/success.png') }}" alt="" width="30%" height="30%" style="margin: 3rem auto 1rem auto">
                <p class="h5 text-center mt-2">{{ session()->get('success') }}</p>
            </div>
        </div>
    </div>
    @endif

    @if(session()->has('error'))
    <div class="modal fade" id="messageModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content align-center" style="height: 290px;">
                <img src="{{ asset('img/error.png') }}" alt="" width="30%" height="30%" style="margin: 3rem auto 1rem auto">
                <p class="h5 text-center mt-2">{{ session()->get('error') }}</p>
            </div>
        </div>
    </div>
    @endif

    @stack('scripts')
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
</body>

</html>
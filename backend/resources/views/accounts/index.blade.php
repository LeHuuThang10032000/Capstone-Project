@extends('layouts.app')

@section('title', 'Người dùng')

@section('content')

<div class="p-3">
    <div class="container-xxl bg-white rounded p-3">
        <div class="d-flex justify-content-between">
            <h3 class="mb-0">Danh sách người dùng</h3>
            <form action="{{ route('user.index') }}" method="GET">
                <input type="text" name="key" style="border-radius: 5px;" placeholder="Tìm kiếm tài khoản">
            </form>
        </div>
        @if($users->count() > 0)
        <hr>
        <table class="table">
            <thead style="background-color: #C7CEEA">
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Tên</th>
                    <th scope="col">Số điện thoại</th>
                    <th scope="col">Trạng thái</th>
                </tr>
            </thead>
            <tbody>
                @foreach($users as $key => $user)
                <tr>
                    <th scope="row">{{$key + 1}}</th>
                    <td>{{$user->f_name}}</td>
                    <td>{{$user->phone}}</td>
                    <td>
                        <form action="{{ route('organiser.activate-user', $user->id) }}" method="POST">
                            @csrf
                            @method('PUT')
                            <button class="px-1 rounded {{ ($user->status == 'active') ? 'btn-theme-warning' : 'btn-theme' }}">{{ ($user->status == 'active') ? 'Vô hiệu hóa' : 'Hoạt động' }}</button>
                        </form>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
        {{ $users->links() }}
        @else
        <hr>
        <div class="text-center">
            <img src="{{ asset('img/no-result.png') }}" alt="" style="margin-left: auto; margin-right: auto; display: block">
            <p class="h5 mt-3">Không tìm thấy kết quả tìm kiếm nào khớp với "{{ $key }}"</p>
            <a href="{{ route('user.index') }}">Quay lại</a>
        </div>
        @endif
    </div>
</div>

@endsection
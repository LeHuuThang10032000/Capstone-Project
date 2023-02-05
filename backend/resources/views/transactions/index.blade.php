@extends('layouts.app')

@section('title', 'Yêu cầu mở cửa hàng')

@section('content')

<div class="p-3">
    <div class="container-xxl bg-white rounded p-0 overflow-hidden">
        <div class="d-flex justify-content-between" style="background-color: #C7CEEA;">
            <p class="h5 mb-0 p-3">Danh sách giao dịch</p>
        </div>
        <div class="tab-content" id="myTabContent">
            @foreach($transactions as $index => $transaction)
            <div class="{{ ($index == 0) ? 'py-2' : 'pb-2' }} px-3">
                <div class="rounded border">
                    <div class="p-3">
                        <p class="m-0">Mã giao dịch: {{$transaction->code}}</p>
                        <div class="rounded border p-2 my-1">
                            <p class="m-0">Thông tin người gửi</p>
                            <p class="m-0">Số diện thoại: {{$transaction->fromUser->phone}}</p>
                            <p class="m-0">Tên: {{$transaction->fromUser->f_name}}</p>
                            <p class="m-0">Trạng thái: <span style="{{ ($transaction->fromUser->status == 'active') ? 'color: #189F7F' : 'color: #E76969' }}">{{$transaction->fromUser->status}}</span></p>
                        </div>
                        <div class="rounded border p-2 my-1">
                            <p class="m-0">Thông tin người nhận</p>
                            <p class="m-0">Số điện thoại: {{$transaction->toUser->phone}}</p>
                            <p class="m-0">Tên: {{$transaction->toUser->f_name}}</p>
                            <p class="m-0">Trạng thái: <span style="{{ ($transaction->toUser->status == 'active') ? 'color: #189F7F' : 'color: #E76969' }}">{{$transaction->toUser->status}}</span></p>
                        </div>
                        <p class="m-0">Thời gian giao dịch: {{$transaction->created_at}}</p>
                    </div>
                </div>
            </div>
            @endforeach
        </div>
        <div class="py-2 px-3">
        {{ $transactions->links() }}
        </div>
    </div>
</div>

@endsection
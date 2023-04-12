@extends('layouts.app')

@section('title', 'Giao dịch')

@section('content')

<div class="p-3">
    <div class="container-xxl bg-white rounded p-0 overflow-hidden">
        <div class="d-flex justify-content-between" style="background-color: #C7CEEA;">
            <p class="h5 mb-0 p-3">Danh sách giao dịch</p>
            <div style="margin: auto 1rem;">
                <form class="mb-0" action="{{ route('organiser.transaction.index') }}" method="GET">
                    <input type="text" name="key" style="border-radius: 5px;" placeholder="Tìm kiếm mã giao dịch">
                </form>
            </div>
        </div>
        <div class="tab-content" id="myTabContent">
        @if($transactions->count() > 0)
            @foreach($transactions as $index => $transaction)
            <div class="{{ ($index == 0) ? 'py-2' : 'pb-2' }} px-3">
                <div class="rounded border">
                    <div class="p-3">
                        <b class="m-0">Mã giao dịch: {{$transaction->code}}</b>
                        <p class="m-0">Số lượng: {{ number_format($transaction->amount) }}đ</p>
                        <div class="rounded border p-2 my-1">
                            <p class="m-0">Thông tin người gửi</p>
                            <p class="m-0">Số diện thoại: {{$transaction->fromUser->phone ?? 'Người dùng VLPay'}}</p>
                            <p class="m-0">Tên: {{$transaction->fromUser->f_name ?? 'Tài khoản đã xóa'}}</p>
                            <p class="m-0">Số dư đầu kỳ: {{isset($transaction->fromDetail->open_balance) ? number_format($transaction->fromDetail->open_balance) : null}}đ</p>
                            <p class="m-0">Số dư đầu kỳ: {{isset($transaction->fromDetail->close_balance) ? number_format($transaction->fromDetail->close_balance) : null}}đ</p>
                        </div>
                        <div class="rounded border p-2 my-1">
                            <p class="m-0">Thông tin người nhận</p>
                            <p class="m-0">Số điện thoại: {{$transaction->toUser->phone ?? 'Người dùng VLPay'}}</p>
                            <p class="m-0">Tên: {{$transaction->toUser->f_name ?? 'Người dùng VLPay'}}</p>
                            <p class="m-0">Số dư đầu kỳ: {{isset($transaction->toDetail->open_balance) ? number_format($transaction->toDetail->open_balance) : null}}đ</p>
                            <p class="m-0">Số dư đầu kỳ: {{isset($transaction->toDetail->close_balance) ? number_format($transaction->toDetail->close_balance) : null}}đ</p>
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
        @else
        <hr>
        <div class="text-center">
            <img src="{{ asset('img/no-result.png') }}" alt="" style="margin-left: auto; margin-right: auto; display: block">
            <p class="h5 mt-3">Không tìm thấy kết quả tìm kiếm nào khớp với "{{ $key }}"</p>
            <a href="{{ route('organiser.transaction.index') }}">Quay lại</a>
        </div>
        @endif
    </div>
</div>

@endsection
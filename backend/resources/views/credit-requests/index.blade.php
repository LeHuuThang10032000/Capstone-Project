@extends('layouts.app')

@section('title', 'Yêu cầu hỗ trợ tín dụng')

@section('content')

<div class="p-3">
    <div class="container-xxl bg-white rounded p-0 overflow-hidden">
        <div class="d-flex justify-content-between" style="background-color: #C7CEEA;">
            <p class="h5 mb-0 p-3">Danh sách yêu cầu hỗ trợ tín dụng</p>
            <div class="d-flex align-items-end px-3">
                <ul class="nav nav-tabs" id="myTab" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" id="pending-tab" data-bs-toggle="tab" data-bs-target="#pending-tab-pane" type="button" role="tab" aria-controls="pending-tab-pane" aria-selected="true" style="color: #000000">Đang chờ</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="approved-tab" data-bs-toggle="tab" data-bs-target="#approved-tab-pane" type="button" role="tab" aria-controls="approved-tab-pane" aria-selected="false" style="color: #000000">Chấp thuận</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="denied-tab" data-bs-toggle="tab" data-bs-target="#denied-tab-pane" type="button" role="tab" aria-controls="denied-tab-pane" aria-selected="false" style="color: #000000">Từ chối</button>
                    </li>
                </ul>
            </div>
        </div>
        <div class="tab-content" id="myTabContent">
            <div class="pt-2 px-3">
                <form action="{{ route('organiser.credit-request.index') }}" method="GET">
                    <input type="text" name="key" style="border-radius: 5px;" placeholder="Tìm kiếm theo tên hay sđt">
                </form>
            </div>
            @if($requests['pending']->count() > 0 || $requests['approved']->count() > 0 || $requests['denied']->count() > 0)
                @include('credit-requests.tabs.approved')
                @include('credit-requests.tabs.pending')
                @include('credit-requests.tabs.denied')
            @else
            <div class="text-center">
                <img src="{{ asset('img/no-result.png') }}" alt="" style="margin-left: auto; margin-right: auto; display: block">
                <p class="h5 mt-3">Không tìm thấy kết quả tìm kiếm nào khớp với "{{ $key }}"</p>
                <a href="{{ route('organiser.credit-request.index') }}">Quay lại</a>
            </div>
            @endif
        </div>
    </div>
</div>

@endsection

@push('scripts')
<script>
    $(window).on('load', function() {
        $('#messageModal').modal('show');
    });
</script>
@endpush
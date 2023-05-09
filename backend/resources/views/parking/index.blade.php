@extends('layouts.app')

@section('title', 'Gửi xe')

@section('content')

<div class="p-3">
    <div class="container-xxl bg-white rounded p-3">
        <form class="row g-3" action="" method="POST">
            @csrf
            <div class="col-auto">
                <label for="parkingFee" class="form-control-plaintext">Phí gửi xe:</label>
            </div>
            <div class="col-auto">
                <input id="parkingFee" class="form-control" type="text" value="{{ $fee['parking_fee'] }}">
            </div>
            <div class="col-auto">
                <button class="btn btn-theme">Cập nhật</button>
            </div>
        </form>
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
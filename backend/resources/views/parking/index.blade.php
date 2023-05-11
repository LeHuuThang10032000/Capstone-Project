@extends('layouts.app')

@section('title', 'Gửi xe')

@section('content')

<div class="p-3">
    <div class="container-xxl bg-white rounded p-3">
        <form id="parkingFee" class="row g-3">
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

    $('#parkingFee').on('submit', function (e) {
            e.preventDefault();
            var formData = new FormData(this);
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
            $.post({
                url: "{{route('')}}",
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                beforeSend: function () {
                    $('#loading').show();
                },
                success: function (data) {
                    $('#table-div').html(data.view);
                    $('#itemCount').html(data.count);
                    $('.page-area').hide();
                },
                complete: function () {
                    $('#loading').hide();
                },
            });
        });
</script>
@endpush
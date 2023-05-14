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
                <input id="parkingFee" name="parking_fee" class="form-control" type="text" value="{{ $fee['parking_fee'] }}">
            </div>
            <div class="col-auto">
                <button type="submit" class="btn btn-theme">Cập nhật</button>
            </div>
        </form>
    </div>

    <div class="container-xxl bg-white rounded p-3 mt-2">
        <p>Tài khoản bảo vệ:</p>
        <form id="sercurity" class="row g-3">
            @csrf
            <select name="sercurities[]" id="sercurity" required multiple=true class="js-example-basic-multiple form-control" style="width: 100%">
                @foreach($users as $user)
                <option value="{{ $user->id }}" {{ ($user->is_sercurity) ? 'selected="selected"' : '' }}>
                    {{ $user->phone }}({{ $user->f_name }})
                </option>
                @endforeach
            </select>
            <i class="mt-1" style="font-size: 15px; opacity: 0.60;">Chọn tài khoản bảo vệ giữ xe</i>
            <div class="col-auto mt-1">
                <button class="btn btn-theme">Cập nhật</button>
            </div>
        </form>
    </div>
</div>

<div class="modal fade" id="successModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content align-center" style="height: 290px;">
            <img id="modelImage" src="" alt="" width="30%" height="30%" style="margin: 3rem auto 1rem auto">
            <p id="modalMessage" class="h5 text-center mt-2"></p>
        </div>
    </div>
</div>

@endsection

@push('scripts')
<script>
    $(document).ready(function() {
        $('.js-example-basic-multiple').select2();
    })

    $('#parkingFee').on('submit', function(e) {
        e.preventDefault();
        var formData = new FormData(this);
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
        $.post({
            url: "{{route('organiser.parking.fee')}}",
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function(data) {
                $('#modelImage').attr('src', data.img);
                $('#modalMessage').html(data.message);
                $('#successModal').modal('show');
            },
            error: function(xhr, status, error) {
                $('#modelImage').attr('src', "{{ asset('img/error.png') }}");
                $('#modalMessage').html(error);
                $('#successModal').modal('show');
            }
        });
    });
</script>
@endpush
@extends('layouts.app')

@section('title', 'Gửi xe')

@section('content')

<div class="p-3">
    <div class="container-xxl bg-white rounded p-3">
        
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
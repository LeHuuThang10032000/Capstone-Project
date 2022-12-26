@extends('layouts.app')

@section('title', 'Accounts')

@section('content')

<div class="p-3">
    <div class="container-xxl bg-white rounded p-3">
        <div class="d-flex justify-content-between">
            <h3 class="mb-0">List Users</h3>
        </div>

        <hr>
        <table class="table">
            <thead style="background-color: #C7CEEA">
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">name</th>
                    <th scope="col">phone</th>
                    <th scope="col">status</th>
                    <th scope="col">action</th>
                </tr>
            </thead>
            <tbody>
                @foreach($users as $key => $user)
                <tr>
                    <th scope="row">{{$key + 1}}</th>
                    <td>{{$user->f_name}}</td>
                    <td>{{$user->phone}}</td>
                    <td>
                        <p class="m-0" style="color: {{ ($user->status == 'active') ? '#189F7F' : '#E76969' }}">{{ $user->status }}</p>
                    </td>
                    <td>
                        <form action="{{ route('organiser.activate-user', $user->id) }}" method="POST">
                            @csrf
                            @method('PUT')
                            <button class="px-1 rounded {{ ($user->status == 'active') ? 'btn-theme-warning' : 'btn-theme' }}">{{ ($user->status == 'active') ? 'deactivate' : 'activate' }}</button>
                        </form>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</div>

@endsection